import { Card } from "@radix-ui/themes";

export type Message = {
  username: string;
  timestamp: number;
  message: string;
  channel: string;
};

export default function MessageList({ messages }: { messages?: Message[] }) {
  if (!messages || messages.length === 0) return "No Messages";
  return (
    <ul>
      {messages.map((message) => (
        <Card key={message.timestamp}>
          {message.message} - {message.username}
        </Card>
      ))}
    </ul>
  );
}
