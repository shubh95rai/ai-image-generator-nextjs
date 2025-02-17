import { z } from "zod";

export const FormSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "Prompt is required!" })
    .min(7, { message: "Prompt must be at least 7 characters long!" })
    .trim(),
});

export type TFormSchema = z.infer<typeof FormSchema>;
