"use client";
import { Checkbox } from "@radix-ui/themes";
import { useState } from "react";

type List = {
  id: string;
  title: string;
  checked: boolean;
  items?: List[];
};

const LIST: List[] = [
  { title: "a.", checked: false, id: "a" },
  { title: "b.", checked: false, id: "b" },
  {
    title: "c.",
    checked: false,
    id: "c",
    items: [
      { title: "c.1", checked: false, id: "c-1" },
      { title: "c.2", checked: false, id: "c-2" },
    ],
  },
];

const CheckboxSet = ({
  title,
  id,
  items,
  state,
  onClick,
}: List & {
  state: Record<string, boolean>;
  onClick: (id: string) => void;
}) => {
  return (
    <li className="ml-4">
      <Checkbox
        checked={state[id] ?? false}
        id={id}
        onCheckedChange={() => onClick(id)}
      />
      <label htmlFor={id}>{title}</label>
      <ul>
        {items
          ? items.map((i) => (
              <CheckboxSet key={i.id} {...i} state={state} onClick={onClick} />
            ))
          : null}
      </ul>
    </li>
  );
};

const flattenList = (
  list: List[],
  check?: boolean,
): Record<string, boolean> => {
  return list
    .flatMap((i) => {
      if (i.items) return i.items;
      return i;
    })
    .reduce(
      (acc, item) => {
        acc[item.id] = check ?? item.checked;
        return acc;
      },
      {} as Record<string, boolean>,
    );
};

export default function Page() {
  const [state, setState] = useState<Record<string, boolean>>(
    flattenList(LIST),
  );

  const handleClick = (id: string) => {
    // check if has children
    const children = LIST.find((i) => i.id === id)?.items;
    if (children) {
      setState((prev) => {
        return {
          ...prev,
          [id]: !prev[id],
          ...flattenList(children, !prev[id]),
        };
      });
    } else {
      setState((prev) => {
        return { ...prev, [id]: !prev[id] };
      });
    }
  };

  return (
    <ul className="p-2">
      {LIST.map((i) => (
        <CheckboxSet key={i.id} {...i} state={state} onClick={handleClick} />
      ))}
    </ul>
  );
}
