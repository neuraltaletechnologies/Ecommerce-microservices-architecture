import { FastifyReply, FastifyRequest } from "fastify";
import Clerk from "@clerk/fastify";
import type { CustomJwtSessionClaims } from "@repo/types";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const shouldBeUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId } = Clerk.getAuth(request);
  if (!userId) {
    return reply.status(401).send({ message: "You are not logged in!" });
  }

  request.userId = userId;
};

export const shouldBeAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const auth = Clerk.getAuth(request);
  if (!auth.userId) {
    return reply.status(401).send({ message: "You are not logged in!" });
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;
  const role = claims.publicMetadata?.role || claims.metadata?.role;
  const allowedRoles = new Set(["admin", "superadmin"]);

  if (!role || !allowedRoles.has(role)) {
    return reply.status(403).send({ message: "Unauthorized!" });
  }

  request.userId = auth.userId;
};
