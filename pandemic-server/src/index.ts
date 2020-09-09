import express from "express";
import * as path from "path";
// TypeORM
import "reflect-metadata";
// MQTT
import { createConnection } from "typeorm";
import { setupMqtt } from "./services/mqtt";
// Controllers
import { getTemperature } from "./controllers/temperatureController";
import { createBatch, updateBatch, deleteBatch, getBatches } from "./controllers/batchesController";
import { getEvents, createEvent } from "./controllers/eventsController";
import { seedTestBatch } from "./helpers/seeds";

// Setup express
const app = express();
const port: number = 8337;

// Connect to the db
createConnection()
  .then((_connection) => {
    console.log("TypeORM connected to db.");
    seedTestBatch();
  })
  .catch((e) => console.error(`TypeORM unable to connect to db: ${e.message}.`));

// Static files
app.use(express.static(path.join(__dirname, "../public")));
export const static_path = (filename: string) => path.join(__dirname, "../public", filename);

// Index
app.get("/", (_req, res) => {
  res.send("⚡🍺");
});

// Temperature graph
app.get("/temperature", getTemperature);

// Batches
app.get("/batches", getBatches);
app.post("/batches", createBatch);
app.post("/batches/:id", updateBatch);
app.put("/batches/:id", updateBatch);
app.delete("/batches/:id", deleteBatch);

// Events
app.get("/events", getEvents);
app.post("/events", createEvent);

// Start server & setup MQTT.
app.listen(port, () => {
  console.log(`Pandemic Server listening on port ${port}...`);
  setupMqtt();
});
