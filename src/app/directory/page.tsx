"use client";

import { Badge, Box, Button, Card, Text, TextField } from "@radix-ui/themes";
import { useMemo, useReducer, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  active: boolean;
};

const initialState: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@test.com",
    role: "admin",
    active: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@test.com",
    role: "member",
    active: true,
  },
  {
    id: "3",
    name: "Carol White",
    email: "carol@test.com",
    role: "member",
    active: false,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@test.com",
    role: "admin",
    active: true,
  },
];

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined;
      if (!immediate) callback.apply(this, args);
    };

    const callNow = immediate && timeout === undefined;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) callback.apply(this, args);
  };
}

/*
1. Render all initialState (name, email, role, active)

2. Add search
filter by name or email - case insen
update as you type (debouncer)
search function(string) => 


3. Add filtering - All, Admins, Members, Active
useMemo(() => filter, [state, filter])

4. No initialState found

*/
type Users = User[];

type UsersAction = { type: "search"; payload: string } | { type: "reset" };

const reducer = (state: Users, action: UsersAction): Users => {
  // debugger;
  switch (action.type) {
    case "search":
      // filtering
      return initialState.filter((i) => {
        if (
          i.email.toLowerCase().startsWith(action.payload.toLowerCase().trim()) ||
          i.name.toLowerCase().startsWith(action.payload.toLowerCase().trim())
        ) {
          return true;
        } else {
          return false;
        }
      });

    case "reset":
      return initialState;

    default:
      return state;
  }
};
type Filter = "all" | "admin" | "member" | "active";

export function UsersList() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState<Filter>("all");

  const handleSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    const query = event.currentTarget.value;
    dispatch({ type: "search", payload: query });
  };

  const handleClear = () => dispatch({ type: "reset" });

  const handleFilter = (type: Filter) => setFilter(type);

  const filteredUsers = useMemo(
    () =>
      state.filter((i) => {
        switch (filter) {
          case "active":
            return i.active;
          case "admin":
            return i.role === "admin";
          case "member":
            return i.role === "member";
          default:
            return i;
        }
      }),
    [state, filter]
  );

  return (
    <div className="p-6 w-[500px] m-auto">
      <div className="flex gap-2 m-2 items-center">
        Filters{" "}
        <Button
          variant={filter === "all" ? "solid" : "outline"}
          onClick={() => handleFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "admin" ? "solid" : "outline"}
          onClick={() => handleFilter("admin")}
        >
          Admins
        </Button>{" "}
        <Button
          variant={filter === "member" ? "solid" : "outline"}
          onClick={() => handleFilter("member")}
        >
          Member
        </Button>{" "}
        <Button
          variant={filter === "active" ? "solid" : "outline"}
          onClick={() => handleFilter("active")}
        >
          Active
        </Button>
      </div>
      <div className="m-2 flex items-center gap-2">
        <TextField.Root className="flex-1" name="search" onChange={handleSearch} />
        <Button type="button" onClick={handleClear}>
          Clear
        </Button>
      </div>
      <div className="p-2 flex gap-2 flex-col">
        {filteredUsers.map((user) => (
          <Card key={user.email}>
            <Box>
              <Text as="div" size="2" weight="bold">
                {user.name}
              </Text>
              <Text as="div" size="2" color="gray">
                {user.email}
              </Text>
              <Text as="div" className="capitalize" size="2" color="gray">
                {user.role}
              </Text>
              <Badge color={user.active ? "green" : "gray"}>
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </Box>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
