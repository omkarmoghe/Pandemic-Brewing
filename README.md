# ![Pandemic Brewing logo](pandemic-client/public/images/logo.png)
⚡️🍺

In August 2020 during the COVID-19 pandemic, my housemate and I decided to start brewing beer.

## Getting Started

### ENV Variables / Secrets

#### `pandemic-client`, `pandemic-db`, `pandemic-mqtt`, `pandemic-server`

Create a `.env` file at the project root. Set all of the following variables to run the server, MQTT broker and Postgres DB via `docker-compose`.

```
CLIENT_PORT="8338"

MQTT_HOST="mqtt://pandemic-mqtt"
MQTT_PASSWORD=""
MQTT_PORT="1883"
MQTT_TOPIC="temperature"
MQTT_USERNAME="pandemic-tech"

POSTGRES_DB="pandemic-db"
POSTGRES_HOST="pandemic-db"
POSTGRES_PASSWORD=""
POSTGRES_PORT="5432"
POSTGRES_USER="pandemic-server"

SERVER_MQTT_CLIENT_ID="pandemic-server"
SERVER_PORT="8337"
```

**Note:** Unfortunately, Mosquitto does not use ENV vars AFAIK, so you also have to update the MQTT `listener` option in `pandemic-mqtt/mosquitto.conf`.

#### Arduino `temperature_monitor`

To run the Arduino temperature monitor create a `temperature_monitor/arduino_secrets.h` header file. Set all of the following variables to connect the Arduino to your WiFi and MQTT Broker. These should match the vars set above where appropriate.

```cpp
#define MQTT_CLIENT_ID "Arduino MKR WiFi 1010";
#define MQTT_HOST "";
#define MQTT_PASSWORD "";
#define MQTT_PORT 1883;
#define MQTT_TOPIC "temperature"
#define MQTT_USERNAME "pandemic-tech";
// This is the Batch that the temperature Events will be linked to. Batch `1` is seeded for testing.
#define PANDEMIC_BATCH_ID 1;
#define SSID "";
#define WPA2_KEY "";
```

**Note:** The `MQTT_HOST` defined in `arduino_secrets.h` cannot use the Docker service host (e.g. `pandemic-mqtt`) that the server uses. This will most likely need be a URL (e.g. hosted) or IP address (e.g. local network).

### Docker

I highly recommend you get started with Docker; it's how I'm deploying this code.

First, make sure an empty directory called `data` exists under `pandemic-db`. If not, make one:
```shell
mkdir pandemic-db/data
```

This will be mounted as a volume to the Postgres container so that data is persisted on your host machine.

Install Docker desktop for your OS, then run `docker-compose build` to build the server images. Run `docker-compose up` to start the Pandemic server, db, and MQTT Broker.

The `pandemic-mqtt` and `pandemic-db` are build directly from published images and just contain configuration files. You can manually run `docker build` and `docker run` in the `pandemic-server` Node.js project.

#### Services

- `pandemic-client`: React/Node.js @ port `CLIENT_PORT`
- `pandemic-db`: Postgres @ port `POSTGRES_PORT`
- `pandemic-mqtt`: Mosquitto @ port `MQTT_PORT`
- `pandemic-server`: Express/Node.js @ port `SERVER_PORT`

### MQTT Messages

To send a message to a MQTT broker running on your local computer:
```shell
mosquitto_pub -h localhost -p 1883 -u pandemic-tech -P PASSWORD -t TOPIC -m "MESSAGE/JSON"
```
