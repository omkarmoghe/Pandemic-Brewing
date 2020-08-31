import TemperatureEvent from "../models/mqtt/TemperatureEvent";
import Event from "../models/Event";
import moment from "moment";
import Batch from "../models/Batch";

import { TEMPERATURE_EVENT } from "./mqtt";

export function temperatureEventHandler(data: TemperatureEvent): Promise<Event> {
  console.log(`[${TEMPERATURE_EVENT}] ${data.temperatureF} F, ${data.temperatureC} C`);

  const event = new Event();
  event.name = TEMPERATURE_EVENT;
  event.at = moment().toDate();
  event.data = { f: data.temperatureF, c: data.temperatureC };
  return Batch.findOne(data.batchId).then((batch) => {
    if (batch) {
      event.batch = Promise.resolve(batch);
      return event.save();
    } else {
      console.error(`Unable to find Batch with id ${data.batchId}. Event not persisted to db.`);
      return event;
    }
  });
}
