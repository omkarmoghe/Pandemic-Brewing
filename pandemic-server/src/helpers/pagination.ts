import { Request } from "express";

const DEFAULT_PAGE = 1;

export function currentPage(req: Request): number {
  return !!req.query.page ? parseInt(req.query.page as string) : DEFAULT_PAGE;
}
