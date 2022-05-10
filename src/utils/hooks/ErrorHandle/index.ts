import { FastifyReply, FastifyRequest } from "fastify";

import { HTTPClientError } from "../../HttpErrors";
import * as ErrorHandlerService from "./ErrorHandler";

export async function ErrorHandle(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  return error instanceof HTTPClientError
    ? ErrorHandlerService.clientError(request, reply, error)
    : ErrorHandlerService.serverError(request, reply, error);
}
