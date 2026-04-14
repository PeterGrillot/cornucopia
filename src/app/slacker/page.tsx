"use client";

import { useMemo, useState } from "react";
import InputForm from "./sections/input-form";
import MessageList, { type Message } from "./sections/message-list";
import SideBar from "./sections/side-bar";

const data = {
  messages: [
    {
      username: "Alice",
      timestamp: Math.floor(Date.now() / 1000),
      message: "Hello Bob!",
      channel: "random",
    },
    {
      username: "Alice",
      timestamp: Math.floor(Date.now() / 1000) - 200,
      message: "Hello Everyone!",
      channel: "general",
    },
  ],
  channels: [
    {
      id: "general",
      name: "general",
    },
    {
      id: "random",
      name: "random",
    },
    {
      id: "engineering",
      name: "engineering",
    },
  ],
};

export default function SlackerPage() {
  const [selectedChannelId, setSelectedChannelId] = useState(data.channels[0].id);
  const [messages, setMessages] = useState(data.messages);

  const handleSelect = (id: string) => setSelectedChannelId(id);

  const handleSubmit = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        username: "Pete",
        timestamp: Math.floor(Date.now() / 1000),
        message,
        channel: selectedChannelId,
      },
    ]);
  };

  const selectedMessages = useMemo(() => {
    return messages.filter((message) => message.channel === selectedChannelId);
  }, [selectedChannelId, messages]);

  return (
    <div className="flex p-4">
      <SideBar channels={data.channels} onSelect={handleSelect} />
      <div className="flex flex-col gap-4 p-4">
        <MessageList messages={selectedMessages} />
        <InputForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
