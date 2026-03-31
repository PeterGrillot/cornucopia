"use client";
import { Badge, Button, Card, Heading, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";

const categories = ["beauty", "fragrances", "groceries", "furniture"] as const;

export interface GetAllProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: (typeof categories)[number];
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string; // ISO string
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  barcode: string;
  qrCode: string;
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filter, setFilter] = useState<Product["category"] | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json: GetAllProductsResponse = await response.json();
        setProducts(json.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (filter === "all") return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products) return <p>No products</p>;

  return (
    <div className="p-2">
      <div className="flex gap-2 items-center mb-4">
        Filter by:
        <Button onClick={() => setFilter("all")}>All</Button>
        {categories.map((category) => (
          <Button key={category} onClick={() => setFilter(category)}>
            <Text as="span" className="capitalize">
              {category}
            </Text>
          </Button>
        ))}
      </div>
      <div className="flex gap-2 flex-col">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <Heading as="h2" size="3">
              {product.title}
            </Heading>
            <Text as="p">{product.description}</Text>
            <Badge className="capitalize">{product.category}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
export default ProductsList;
