import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .min(3, {
      message: "Fullname must be more than 3 character",
    })
    .max(150, { message: "Fullname must be less than 150 character" }),
  username: z
    .string()
    .min(3, {
      message: "Username must be more than 3 character",
    })
    .max(150, {
      message: "Username mustb be less than 150 character",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username can only contain letters, number and -",
    }),
});

export function onboardingSchemaValidation(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return z.object({
    username: z
      .string()
      .min(3, {
        message: "Username must be more than 3 character",
      })
      .max(150, {
        message: "Username mustb be less than 150 character",
      })
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Username can only contain letters, number and -",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already used",
              });
            }
          });
        })
      ),
    fullName: z
      .string()
      .min(3, {
        message: "Fullname must be more than 3 character",
      })
      .max(150, { message: "Fullname must be less than 150 character" }),
  });
}

export const settingsSchema = z.object({
  fullname: z
    .string()
    .min(3, {
      message: "Fullname must be more than 3 character",
    })
    .max(150, { message: "Fullname must be less than 150 character" }),
  profileImage: z.string(),
});

export const eventTypeSchema = z.object({
  title: z.string().min(3).max(150),
  duration: z.number().min(15).max(60),
  url: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  videoCallSoftware: z.string().min(3),
});
