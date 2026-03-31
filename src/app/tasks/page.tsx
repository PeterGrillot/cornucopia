"use client";
import { Button, Checkbox, TextField } from "@radix-ui/themes";
import { ChangeEvent, Ref, useMemo, useReducer, useRef, useState } from "react";

function generateUuid(): string {
  return crypto.randomUUID();
}

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const initialState = [{ id: "1", title: "example", completed: false }];

type Action =
  | { type: "add"; payload: { title: string } }
  | { type: "toggleComplete"; payload: { id: string } }
  | { type: "sortCompleted" }
  | { type: "sortActive" };

const filters = ["all", "active", "completed"] as const;
type Filter = (typeof filters)[number];

const reducer = (state: Task[], action: Action) => {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { id: generateUuid(), title: action.payload.title, completed: false },
      ];

    case "sortCompleted":
      return [
        ...state.filter((i) => i.completed),
        ...state.filter((i) => !i.completed),
      ];

    case "sortActive":
      return [
        ...state.filter((i) => !i.completed),
        ...state.filter((i) => i.completed),
      ];

    case "toggleComplete":
      const newState = state.map((task) => {
        if (task.id !== action.payload.id) {
          return task;
        }
        return { ...task, completed: !task.completed };
      });

      return newState;
    default:
      return state;
  }
};

export function TasksPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState<Filter>("all");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFilter = (type: Filter) => setFilter(type);

  const handleToggle = (task: Task) =>
    dispatch({ type: "toggleComplete", payload: task });

  const handleSort = (type: "sortCompleted" | "sortActive") =>
    dispatch({ type });
  const handleSubmitTask = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({
      type: "add",
      payload: {
        title: event.currentTarget.taskTitle.value,
      },
    });
    if (inputRef?.current) inputRef.current.value = "";
  };

  if (!state) return <p>No tasks</p>;

  const filteredState = useMemo(() => {
    switch (filter) {
      case "active":
        return state.filter((i) => !i.completed);
      case "completed":
        return state.filter((i) => i.completed);
      default:
        return state;
    }
  }, [state, filter]);

  return (
    <div className="m-auto w-[604px] p-2">
      <div className="flex gap-2 mb-4 items-center">
        Filter
        {filters.map((item) => (
          <Button
            key={item}
            variant={filter === item ? "solid" : "outline"}
            onClick={() => handleFilter(item)}
          >
            <span className="capitalize">{item}</span>
          </Button>
        ))}
      </div>
      <div className="flex gap-2 mb-4 items-center">
        Sort
        <Button onClick={() => handleSort("sortCompleted")}>Completed</Button>
        <Button onClick={() => handleSort("sortActive")}>Active</Button>
      </div>
      <ul>
        {filteredState.map((task) => (
          <li key={task.id} className="flex items-center gap-2">
            <Checkbox
              id={task.id}
              name={task.id}
              checked={task.completed}
              onClick={() => handleToggle(task)}
            />
            <label htmlFor={task.id}>{task.title}</label>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmitTask} className="mt-4 flex gap-2">
        <TextField.Root ref={inputRef} className="flex-1" name="taskTitle" />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
}

export default TasksPage;

/*
Tasks Component with sort by [all][active][complete]

Proposed UI:
  [title []]
  [title []]
  [title []]
  [input][add]

Requirements
- Toggle completion
  checkbox => completed to !prev.complete

- Add new task
  Add new task button
  form: title, completed: false

- Filter
  Select option
  All
  completed: completed === true
  Active (incomplete): completed === false
*/
