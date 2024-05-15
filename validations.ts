import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1,{
    message: "Please provide a valid email",
  }),
  password: z.string().min(1, {
    message: "Please provide a password",
  }),

   code: z.optional(
      z.string().min(6, {
        message: "Please provide a code",
      }),
    ), 
   
 
});

export const RegisterSchema = z.object({
  //[UsernameSchema]
  email: z.string().email({
    message: "Please provide a valid email",
  }),
  password: z.string().min(6, {
    message: "Please provide a password with at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Please provide a name",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Please provide a password with at least 6 characters",
  }),
});
export const UpdateUserSchema = z.object({
  name: z.string().min(1, {
    message: "Please provide a name",
  }),
  //[UsernameSchema]
});

export const SetPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32)
    .optional()
    .or(z.literal("")),
  newPassword: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
  confirmNewPassword: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
});

export const TwoFactorTogglerSchema = z.object({
  twoFactorEnabled: z.optional(z.boolean()),
});

export const DeleteAccountSchema = z.object({
  password: z.string().min(6, {
    message: "Please provide a password with at least 6 characters",
  }),
});