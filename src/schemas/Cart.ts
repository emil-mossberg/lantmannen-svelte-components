import { z } from "zod";

export const CartSchema = z.object({
  grand_total_incl_tax: z.string(),
  grand_total_excl_tax: z.string()
  // TO DO add more
});

export type CartType = z.infer<typeof CartSchema>;