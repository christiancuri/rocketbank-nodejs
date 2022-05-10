import { FastifyRequest as Req, FastifyReply as Res } from "fastify";

export type UserProps = {
  ip?: string;
  _id: string;
  userId: string;
};

declare module "fastify" {
  interface FastifyRequest {
    user?: UserProps;
  }
}

export { Req, Res };
