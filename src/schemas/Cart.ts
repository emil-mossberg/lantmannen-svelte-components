import { z } from "zod";

const ProductImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
});

const ProductPriceValueSchema = z.object({
  incl_tax: z.string(), // e.g., "26.5000"
  excl_tax: z.string(), // e.g., "23.2500"
});

const CartItemSchema = z.object({
  canApplyMsrp: z.boolean(),
  configure_url: z.string().url(),
  is_visible_in_site_visibility: z.boolean(),
  item_id: z.string(),
  message: z.string(),
  options: z.array(z.any()), // You can make this more specific if needed
  product_brand: z.string(),
  product_category: z.string(),
  product_has_url: z.boolean(),
  product_id: z.string(),
  product_image: ProductImageSchema,
  product_name: z.string(),
  product_price: z.string(), // raw HTML string
  product_price_value: ProductPriceValueSchema,
  product_sku: z.string(),
  product_type: z.string(),
  product_url: z.string().url(),
  qty: z.number(),
});

export const CartSchema = z.object({
  cart_empty_message: z.string(),
  data_id: z.number(),
  extra_actions: z.string(),
  grand_total_excl_tax: z.string(), // HTML string
  grand_total_incl_tax: z.string(), // HTML string
  isGuestCheckoutAllowed: z.boolean(),
  items: z.array(CartItemSchema),
  possible_onepage_checkout: z.boolean(),
  storeId: z.string(),
  subtotal: z.string(), // HTML string
  subtotalAmount: z.number(),
  subtotal_excl_tax: z.string(),
  subtotal_incl_tax: z.string(),
  summary_count: z.number(),
  website_id: z.string(),
});

export type CartType = z.infer<typeof CartSchema>;