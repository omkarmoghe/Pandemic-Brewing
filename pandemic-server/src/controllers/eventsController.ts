import { Request, Response } from "express";
import Event from "../models/Event";
import { currentPage } from "../helpers/pagination";

const PAGE_SIZE = 100;

export function createEvent(_req: Request, _res: Response): void {
}

export async function getEvents(req: Request, res: Response): Promise<void> {
  const batchId: number = parseInt(req.params.batchId);
  const events = await Event.createQueryBuilder("event")
    .where("'event.batchId' = :batchId", { batchId })
    .orderBy("at", "DESC")
    .skip((currentPage(req) - 1) * PAGE_SIZE)
    .take(PAGE_SIZE)
    .getMany();

  res.status(200);
  res.json({ events });
}
