// Monitors the DS18B20 temperature sensor and publishes the readings over MQTT.
#include <SPI.h>
#include <WiFiNINA.h>
#include <CooperativeMultitasking.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "arduino_secrets.h"

// Timing
const int CONNECTION_DELAY_MS = 5 * 1000; // 5 seconds
const int TEMPERATURE_DELAY_MS = 3 * 60 * 1000; // 3 minutes

// Temperature
const int ONE_WIRE_BUS = 2;
OneWire one_wire;
DallasTemperature sensors;

// WiFi
const char ssid[] = SSID;
const char pass[] = WPA2_KEY;
int status = WL_IDLE_STATUS;
WiFiClient wifi_client;

// Pandemic
const uint32_t pandemic_batch_id = PANDEMIC_BATCH_ID;

// MQTT
const char mqtt_host[] = MQTT_HOST;
const u_int16_t mqtt_port = MQTT_PORT;
const char mqtt_topic_name[] = MQTT_TOPIC;
const char mqtt_client_id[] = MQTT_CLIENT_ID;
const char mqtt_username[] = MQTT_USERNAME;
const char mqtt_password[] = MQTT_PASSWORD;
bool mqtt_connected = false;
CooperativeMultitasking tasks;
MQTTClient *mqtt_client;
MQTTTopic *mqtt_topic;

void setup_wifi() {
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    exit(1);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the WiFiNINA firmware.");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 5 seconds for connection:
    delay(CONNECTION_DELAY_MS);
  }

  // Print network info.
  Serial.print("IP aAddress: ");
  Serial.println(WiFi.localIP());
  Serial.print("Signal strength (RSSI):");
  Serial.println(WiFi.RSSI());
}

void setup_mqtt() {
  // Init
  Serial.println("Initializing MQTT client...");
  mqtt_client = new MQTTClient(&tasks, &wifi_client, mqtt_host, mqtt_port, mqtt_client_id, mqtt_username, mqtt_password);
  // Connect
  Serial.print("Attempting to connect to MQTT broker @");
  Serial.println(mqtt_host);
  while (!mqtt_connected) {
    mqtt_connected = mqtt_client->connect();
    delay(CONNECTION_DELAY_MS);
  }

  mqtt_topic = new MQTTTopic(mqtt_client, mqtt_topic_name);
}

void setup_temperature_sensor() {
  one_wire = OneWire(ONE_WIRE_BUS);
  sensors = DallasTemperature(&one_wire);
  sensors.begin();

  tasks.now(measure_temperature);
}

void measure_temperature() {
  sensors.requestTemperatures();
  tasks.now(publish_temperature);
  tasks.after(TEMPERATURE_DELAY_MS, measure_temperature);
}

void publish_temperature() {
  DynamicJsonDocument event(256);
  event["temperatureF"] = sensors.getTempFByIndex(0);
  event["temperatureC"] = sensors.getTempCByIndex(0);
  event["batchId"] = pandemic_batch_id;

  String serialized_json;
  serializeJson(event, serialized_json);
  mqtt_topic->publish(serialized_json.c_str());
}

void setup() {
  //Initialize serial and wait for port to open.
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Pandemic temperature sensor alive!");

  setup_wifi();
  setup_mqtt();
  setup_temperature_sensor();
}

void loop() {
  tasks.run();
}
