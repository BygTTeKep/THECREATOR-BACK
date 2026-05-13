export class GetDropByIdOrmDto {
  drop_id: number;
  drop_tier: number;
  drop_name: string;
  drop_description: string;
  drop_starts_at: Date;
  drop_ends_at: Date;
  drop_is_active: boolean;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_base_cost: number;
  product_price: number;
  product_total_stock: number;
  product_created_at: Date;
}
