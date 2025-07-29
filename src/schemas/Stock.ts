import { z } from "zod";

export const StockSchema = z.object({
  allow_backorder: z.boolean(),
  current_available_stock: z.string(), 
  data_from_cache: z.boolean(),
  express_delivery: z.boolean(),
  in_stock: z.boolean(),
  in_stock_date: z.string(), 
  item_number: z.string(), 
  order_date: z.string(), 
  package_delivery: z.boolean(),
  pickup_delivery: z.boolean(),
  product_id: z.string().nullable(),
  quantity: z.number(),
  stock_levels_hidden: z.boolean(),
  unit_measure: z.string(), 
});

export type Stock = z.infer<typeof StockSchema>;