import { Request, Response } from "express";
import Event from "../models/Event";
import { currentPage } from "../helpers/pagination";

const PAGE_SIZE = 100;

export function createEvent(_req: Request, _res: Response): void {
}

export async function getEvents(req: Request, res: Response): Promise<void> {
  if (req.query.batchId) {
    const batchId: number = parseInt(req.query.batchId as string);
    const events = await Event.createQueryBuilder("event")
      .where("'event.batchId' = :batchId", { batchId })
      .orderBy("at", "DESC")
      .skip((currentPage(req) - 1) * PAGE_SIZE)
      .take(PAGE_SIZE)
      .getMany();

    res.status(200);
    res.json({ events });
  } else {
    res.status(422);
    res.json({ errors: ["No batchId provided."] });
  }
}
