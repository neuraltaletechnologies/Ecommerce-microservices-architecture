import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { CustomJwtSessionClaims } from "@repo/types";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return res.status(401).json({ message: "You are not logged in!" });
  }

  req.userId = auth.userId;

  return next();
};

export const shouldBeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return res.status(401).json({ message: "You are not logged in!" });
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;
  const userRole = claims.publicMetadata?.role || claims.metadata?.role;

  console.log('Auth Service - Admin Check:', {
    userId,
    userRole,
    hasPublicMetadata: !!claims.publicMetadata,
    hasMetadata: !!claims.metadata
  });

  if (userRole !== "admin") {
    return res.status(403).send({ message: "Unauthorized! Admin access required." });
  }

  req.userId = auth.userId;

  return next();
};
