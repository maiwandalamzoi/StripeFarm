/**
 * Class containing information about the Express structure of the microservice.
 */

import { Router, Request, Response, NextFunction } from "express";

type Wrapper = ((router: Router) => void);

/**
 * Apply the middleware of the express server.
 * @param middlewareWrappers
 * @param router
 */
export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

/**
 * Request/Promise handler of calls.
 */
type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Route handler.
 */
type Route = {
  path: string;
  method: string;
  handler: Handler | Handler[];
};

/**
 * Apply the routes of the microservice, creating the API endpoints
 * @param routes
 * @param router
 */
export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler } = route;
    (router as any)[method](path, handler);
  }
};
