import { FastifyReply, FastifyRequest } from "fastify";

import { HTTPClientError } from "@/utils/HttpErrors";

import { logger } from "../..";

export async function clientError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: HTTPClientError,
): Promise<void> {
  reply.status(error.statusCode).send({ message: error.message || error });
}

export async function serverError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: Error,
): Promise<void> {
  const msg = error.stack ? `\n ${error.stack}` : ` - ${error}`;
  logger.error(`${new Date()} - ${request.method} - ${request.url} ${msg}`);
  let message;

  try {
    message = error.message ? JSON.parse(error.message) : error;
  } catch (error) {
    message = error.message || error;
  }

  reply.status(500).send({ message });
}
