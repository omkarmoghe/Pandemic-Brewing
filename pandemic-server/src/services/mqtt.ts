import * as mqtt from "mqtt"
import { MqttClient } from "mqtt"
import TemperatureEvent from "../models/mqtt/TemperatureEvent";
import { temperatureEventHandler } from "./mqttHandlers";

let client: MqttClient

// Event types
export const TEMPERATURE_EVENT = "temperature";

export function setupMqtt(): void {
  console.log(`Connecting to MQTT host ${process.env.MQTT_HOST}...`);
  client = mqtt.connect(
    process.env.MQTT_HOST,
    {
      port: !!process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 1883,
      clientId: process.env.SERVER_MQTT_CLIENT_ID,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    }
  );

  client.on("connect", onMQTTConnect);
  client.on("message", onMQTTMessage);
}

function onMQTTConnect(_connAck: mqtt.Packet): void {
  const mqttTopic = process.env.MQTT_TOPIC || "temperature";

  console.log(`Subscribing to topic ${mqttTopic}...`);
  client.subscribe(mqttTopic, (err, granted) => {
    if (err) {
      console.error(err.message);
    }

    if (granted && granted.length) {
      console.log(`Subscribed to ${granted.length} topics.`);
    }
  });
}

function onMQTTMessage(topic: string, message: Buffer, _packet: mqtt.Packet): void {
  try {
    switch (topic) {
      case TEMPERATURE_EVENT:
        const data: TemperatureEvent = JSON.parse(message.toString());
        temperatureEventHandler(data);
        break;
      default:
        console.log(`[${topic}] ${message}`);
        break;
    }
  } catch (e) {
    console.error(`Unable to handle MQTT message ${message.toString()} on topic ${topic}`);
    console.error(e);
  }
}
