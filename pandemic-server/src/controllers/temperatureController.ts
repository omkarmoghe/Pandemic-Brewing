import { Request, Response } from "express";
import { static_path } from "..";

export function getTemperature(_req: Request, res: Response) {
  res.sendFile(static_path("temperature.html"));
}
