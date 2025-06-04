import { z } from "zod";
import bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { ok,badReq } from "@/app/api/utils/responses";

export const userRouter = createTRPCRouter(
    {
    authenticateUser: publicProcedure
    .input(z.object({
        email: z.string().email(),
        password: z.string()
    }))
    .query(async ({ ctx,input }) => {   
    const user = await ctx.db.user.findUniqueOrThrow({
      where: { email: input.email  },
    });
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) return badReq("Email o contraseña incorrectos");
    return ok({
        user: {
          id: user.id,
          email: user.email,
        },
      });
  }),
    registerUser: publicProcedure
        .input(z.object({   
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(8, { message: "Password must be at least 8 characters long" })
              .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
              .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
              .regex(/[0-9]/, { message: "Password must contain at least one number" })
              .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }), }))
        .mutation(async ({ ctx, input }) => {
          return ctx.db.user.create({
            data: {
                name: input.name,
                email: input.email,
                password: await bcrypt.hash(input.password, 10),
            },
          });
        }),

    }
)