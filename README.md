# ![Pandemic Brewing logo](pandemic-server/public/images/logo.png)
⚡️🍺

In August 2020 during the COVID-19 pandemic, my housemate and I decided to start brewing beer.

## Getting Started

### ENV Variables / Secrets

#### `pandemic-server`, `pandemic-mqtt`, `pandemic-db`

Create a `.env` file at the project root. Set all of the following variables to run the server, MQTT broker and Postgres DB via `docker-compose`.

```
SERVER_PORT="8337"
SERVER_MQTT_CLIENT_ID="pandemic-server"

MQTT_HOST="mqtt://pandemic-mqtt"
MQTT_PORT="1883"
MQTT_TOPIC="temperature"
MQTT_USERNAME="pandemic-tech"
MQTT_PASSWORD=""

POSTGRES_HOST="pandemic-db"
POSTGRES_PORT="5432"
POSTGRES_USER="pandemic-server"
POSTGRES_PASSWORD=""
POSTGRES_DB="pandemic-db"
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
#define PANDEMIC_BATCH_ID 0; // This is the brew Batch that the temperature Events will be attached to.
#define SECRET_SSID "";
#define SECRET_WPA2_KEY "";
```

**Note:** The `MQTT_HOST` defined in `arduino_secrets.h` cannot use the Docker service host (e.g. `pandemic-mqtt`) that the server uses. This will most likely need be a URL (e.g. hosted) or IP address (e.g. local network).

### Docker

I highly recommend you get started with Docker; it's how I'm deploying this code. And chances are I may never update the instructions in the [manual build](#Manual-Build) section 😅.

First, make sure an empty directory called `data` exists under `pandemic-db`. If not, make one with `mkdir pandemic-db/data`. This will be mounted as a volume to the Postgres container so that data is persisted on your host machine.

Install Docker desktop for your OS, then run `docker-compose build` to build the server images. Run `docker-compose up` to start the Pandemic server, db, and MQTT Broker.

The `pandemic-mqtt` and `pandemic-db` are build directly from published images and just contain configuration files. You can manually run `docker build` and `docker run` in the `pandemic-server` Node.js project.

#### Services

- `pandemic-db`: Postgres @ port `5432`
- `pandemic-mqtt`: Mosquitto @ port `1883`
- `pandemic-server`: Express/Node.js @ port `8337`

### Manual Build

#### `pandemic-db` (or any relational database)

Instructions TBD.

#### `pandemic-mqtt` (or any MQTT broker)

Instructions TBD.

#### `pandemic-server`

Instructions TBD.

### MQTT Messages

To send a message to a MQTT broker running on your local computer:
```shell
mosquitto_pub -h localhost -p 1883 -u pandemic-tech -P PASSWORD -t TOPIC -m "MESSAGE/JSON"
```
