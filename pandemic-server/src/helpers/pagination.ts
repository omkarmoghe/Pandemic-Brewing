import { Request } from "express";

const DEFAULT_PAGE = 1;

export function currentPage(req: Request): number {
  return !!req.params.page ? parseInt(req.params.page) : DEFAULT_PAGE;
}
