import { z } from "zod";
import { store } from "../services/store.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

export async function authRoutes(fastify) {
  fastify.post("/auth/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest("Invalid login payload");
    }

    const { email, password } = parsed.data;
    const user = await store.authenticateUser(email, password);
    if (!user) {
      return reply.unauthorized("Invalid credentials");
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await reply.jwtSign(
      { ...tokenPayload, tokenType: "access" },
      { expiresIn: "30m" }
    );
    const refreshToken = await reply.jwtSign(
      { ...tokenPayload, tokenType: "refresh" },
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: 1800,
      },
    };
  });

  fastify.post("/auth/refresh", async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest("Invalid refresh payload");
    }

    try {
      const decoded = await fastify.jwt.verify(parsed.data.refreshToken);
      if (decoded.tokenType !== "refresh") {
        return reply.unauthorized("Invalid refresh token");
      }

      const accessToken = await reply.jwtSign(
        {
          sub: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          tokenType: "access",
        },
        { expiresIn: "30m" }
      );

      return {
        accessToken,
        tokenType: "Bearer",
        expiresIn: 1800,
      };
    } catch (_error) {
      return reply.unauthorized("Refresh token expired or invalid");
    }
  });
}
