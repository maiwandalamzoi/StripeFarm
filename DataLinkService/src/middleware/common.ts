/*
A common.ts file contains the middleware like cors, compression and, the setup
for body parsing. Later we will add middleware for logging, security, caching
and more. Paste it in ./middleware/common.ts:
*/
import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};
