import { Request, Response } from "express";
import Batch from "../models/Batch";
import { currentPage } from "../helpers/pagination";

const PAGE_SIZE = 100;

export async function getBatches(req: Request, res: Response): Promise<void> {
  const batches = await Batch.createQueryBuilder()
    .orderBy("id", "DESC")
    .skip((currentPage(req) - 1) * PAGE_SIZE)
    .take(PAGE_SIZE)
    .getMany();

  res.status(200);
  res.json({ batches });
}

export async function createBatch(req: Request, res: Response): Promise<void> {
  const batch = new Batch();
  batch.name = req.body.name;
  batch.description  = req.body.description;
  await batch.save();

  res.status(201);
  res.json({ batch });
}

export async function updateBatch(req: Request, res: Response): Promise<void> {
  const batch = await Batch.findOne(req.params.id);

  if (batch) {
    if (req.body.name) {
      batch.name = req.body.name;
    }

    if (req.body.description) {
      batch.description = req.body.description;
    }

    await batch.save();

    res.status(200);
    res.json({ batch });
  } else {
    res.status(422);
    res.json({ errors: [`Unable to find Batch ${req.params.id}.`] });
  }
}

export async function deleteBatch(req: Request, res: Response): Promise<void> {
  const batch = await Batch.findOne(req.params.id);
  if (batch) {

  } else {
    res.status(422);
    res.json({ errors: [`Unable to find Batch ${req.params.id}.`] });
  }
}
