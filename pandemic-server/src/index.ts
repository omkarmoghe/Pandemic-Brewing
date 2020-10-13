import express from "express";
import bodyParser from "body-parser"
// TypeORM
import "reflect-metadata";
// MQTT
import { createConnection } from "typeorm";
import { setupMqtt } from "./services/mqtt";
// Controllers
import { createBatch, updateBatch, deleteBatch, getBatches } from "./controllers/batchesController";
import { getEvents, createEvent } from "./controllers/eventsController";
import { seedTestBatch } from "./helpers/seeds";

// Setup express
const app = express();
const port: number = !!process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8337

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // use qs over querystring
app.use(bodyParser.json());

// Connect to the db
createConnection()
  .then((_connection) => {
    console.log("TypeORM connected to db.");
    seedTestBatch();
  })
  .catch((e) => console.error(`TypeORM unable to connect to db: ${e.message}.`));

// Index
app.get("/", (_req, res) => {
  res.send("⚡🍺");
});

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
