import { z } from "zod";

// Zod schema
export const ProductSchema = z.object({
  product_id: z.number(),
  tax_class_id: z.number(),
  customer_number: z.string(),
  product_sku: z.string(),
  price_format: z.string(),

  price_info: z.object({
    final_price: z.number(),
    max_price: z.number(),
    max_regular_price: z.number(),
    minimal_regular_price: z.number(),
    special_price: z.number().nullable(),
    minimal_price: z.number(),
    regular_price: z.number(),

    formatted_prices: z.object({
      final_price: z.string(),
      max_price: z.string(),
      minimal_price: z.string(),
      max_regular_price: z.string(),
      minimal_regular_price: z.string().nullable(),
      special_price: z.string().nullable(),
      regular_price: z.string(),
    }),

    extension_attributes: z.object({
      msrp: z.object({
        msrp_price: z.string(),
        is_applicable: z.string(),
        is_shown_price_on_gesture: z.string(),
        msrp_message: z.string(),
        explanation_message: z.string(),
      }),

      tax_adjustments: z.object({
        final_price: z.number(),
        max_price: z.number(),
        max_regular_price: z.number(),
        minimal_regular_price: z.number(),
        special_price: z.number(),
        minimal_price: z.number(),
        regular_price: z.number(),
        formatted_prices: z.object({
          final_price: z.string(),
          max_price: z.string(),
          minimal_price: z.string(),
          max_regular_price: z.string(),
          minimal_regular_price: z.string().nullable(),
          special_price: z.string(),
          regular_price: z.string(),
        }),
      }),

      weee_attributes: z.array(z.any()),

      weee_adjustment: z.string(),

      lma_customer_price: z.number(),
      lma_customer_price_formatted: z.string(),
      lma_customer_price_is_campaign: z.boolean(),
      lma_vat_percentage: z.number(),
      lma_unit_measure: z.string(),
      lma_valid_price_inc_vat: z.number(),
      lma_valid_price_inc_vat_formatted: z.string(),
      lma_line_amount: z.number(),
      lma_line_amount_inc_vat: z.number(),
      lma_quantity: z.number(),
      lma_price_lookup_done: z.boolean(),
      lma_custom_price_set: z.boolean(),
      lma_campaign_price: z.number(),
      lma_campaign_price_inc_vat: z.number(),
      lma_profix_price: z.number(),
      lma_profix_price_inc_vat: z.number(),
      lma_campaign_payment_terms: z.string(),
      lma_campaign_fixed_due_date: z.string(),
      lma_list_price: z.number(),
      lma_list_price_formatted: z.string(),
      lma_list_price_inc_vat: z.number(),
      lma_list_price_inc_vat_formatted: z.string(),
      lma_is_pallet_discount: z.boolean(),
    }),
  }),

  price_cached: z.boolean(),
  order_date: z.string(),
  campaign_cat_id: z.number(),
  campaign_type: z.string(),
  promotion_id: z.string(),
  product_group: z.string(),
  immediate_delivery_while_pss: z.boolean(),
  promotion_id_period: z.null(),
  transaction_reason: z.string(),
});

// Inferred TypeScript type
export type Product = z.infer<typeof ProductSchema>;