"use client";
import { Badge, Button, Card, Flex, Text } from "@radix-ui/themes";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

const PRODUCTS: Product[] = [
  { id: 1, name: "Apple", price: 0.99 },
  { id: 2, name: "Bread", price: 2.49 },
  { id: 3, name: "Milk", price: 5.0 },
  { id: 4, name: "Cheese", price: 2.0 },
  { id: 5, name: "Eggs", price: 7.6 },
  { id: 6, name: "Butter", price: 4.0 },
];

type Cart = Record<number, number>;

function ProductCard({
  id,
  name,
  price,
  handleAdd,
  disabled,
}: Product & {
  handleAdd?: (id: number) => void;
  disabled?: boolean;
}) {
  return (
    <Card key={id}>
      <Text as="div" weight="bold">
        {name}
      </Text>
      <Text as="div" color="gray" size="2">
        ${Number(price).toFixed(2)}
      </Text>
      <Flex>
        {handleAdd ? (
          <Button
            size="1"
            ml="auto"
            disabled={disabled}
            onClick={() => handleAdd(id)}
          >
            Add to Cart
          </Button>
        ) : null}
      </Flex>
    </Card>
  );
}

function CartCard({
  id,
  name,
  price,
  quantity,
  handleRemove,
}: Product & {
  handleRemove: (id: number) => void;
  quantity: number;
}) {
  return (
    <Card>
      <Text as="div" weight="bold">
        {name} {quantity ? <Badge>{quantity}</Badge> : null}
      </Text>
      <Text as="div" color="gray" size="2">
        ${price}
      </Text>
      <Flex>
        {handleRemove ? (
          <Button
            size="1"
            ml="auto"
            onClick={() => handleRemove(id)}
            variant="outline"
          >
            Remove
          </Button>
        ) : null}
      </Flex>
    </Card>
  );
}

function PricePage() {
  const [cart, setCart] = useState<Cart>({});

  const handleAdd = (id: number) =>
    setCart((prev) => {
      if (prev[id] >= 10) {
        // Cap at 10
        return { ...prev };
      } else if (!!prev[id]) {
        // Add
        return { ...prev, [id]: prev[id] + 1 };
      }
      // Init Add
      return { ...prev, [id]: 1 };
    });

  const handleRemove = (id: number) =>
    setCart((prev) => {
      if (prev[id] > 1) {
        // Remove
        return { ...prev, [id]: prev[id] - 1 };
      }
      // Delete 0
      const old = { ...prev };
      delete old[id];

      return old;
    });

  const total = useMemo(() => {
    const totals = Object.keys(cart).map((item) => {
      const found = PRODUCTS.find((i) => i.id === Number(item));
      if (!found) return 0;
      const quantity = cart[Number(item)];
      return found.price * quantity;
    });
    return Number(totals.reduce((a: number, b: number) => a + b, 0)).toFixed(2);
  }, [cart]);

  const handleClear = () => setCart({});

  return (
    <Flex gap="2" p="4" width="100">
      <Flex direction="column" gap="2" maxWidth="350px" flexGrow="1">
        <Text as="div" weight="bold">
          Inventory
        </Text>
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            handleAdd={handleAdd}
            disabled={cart[product.id] > 9}
          />
        ))}
      </Flex>
      <Flex
        style={{ borderLeft: "1px solid #eee" }}
        direction="column"
        gap="2"
        maxWidth="200px"
        flexGrow="1"
        pl="2"
      >
        <Text as="div" weight="bold">
          Cart
        </Text>
        {Object.keys(cart).length ? (
          <>
            {Object.keys(cart).map((item) => {
              const found = PRODUCTS.find((i) => i.id === Number(item));
              const quantity = cart[Number(item)] ?? 0;
              if (found) {
                return (
                  <CartCard
                    key={item}
                    {...found}
                    quantity={quantity}
                    handleRemove={() => handleRemove(found.id)}
                  />
                );
              }
              return null;
            })}

            <Button variant="outline" onClick={handleClear}>
              Clear Cart
            </Button>
          </>
        ) : (
          <Text size="2" color="gray">
            Cart is empty
          </Text>
        )}
        <Text>Total: ${total}</Text>
      </Flex>
    </Flex>
  );
}

export default PricePage;
