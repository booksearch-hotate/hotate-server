import { Request } from "express";

export default function OriginMake (req: Request) {
  const origin = req.protocol + '://' + req.headers.host;
  return origin;
}
