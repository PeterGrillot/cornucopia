import { Button, TextField } from "@radix-ui/themes";
import { SyntheticEvent } from "react";

export default function InputForm({ onSubmit }: { onSubmit: (message: string) => void }) {
  const handleSubmit = (formData: FormData) => {
    const message = formData.get("input") as string;
    if (message) onSubmit(message);
  };
  return (
    <form action={handleSubmit} className="flex gap-4">
      <TextField.Root name="input" />
      <Button type="submit">Send</Button>
    </form>
  );
}
