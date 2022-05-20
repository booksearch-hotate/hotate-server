import {Request} from 'express';

export default function originMake(req: Request) {
  const origin = req.protocol + '://' + req.headers.host;
  return origin;
}
