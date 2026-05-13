export class GetProductOrmDto {
  id: string;
  drop_id: number;
  name: string;
  sku: string;
  base_cost: number;
  price: number;
  total_stock: number;
  metadata: Record<string, any>;
  created_at: Date;
}
