/**
 * The checkout form and POST /api/orders validate against the same schema —
 * see src/shared/contracts/order.contract.ts. Kept as a re-export so existing
 * imports (and the form's `zodResolver`) stay unchanged.
 */
export {
  createOrderSchema as orderSchema,
  type CreateOrderInput as OrderSchemaValues,
} from '@/src/shared/contracts';
