import { Button } from "@radix-ui/themes";

type Channel = {
  id: string;
  name: string;
};

export default function SideBar({
  channels,
  onSelect,
}: {
  channels: Channel[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul>
      {channels.map((channel) => (
        <li key={channel.id}>
          <Button variant="ghost" onClick={() => onSelect(channel.id)}>
            #{channel.name}
          </Button>
        </li>
      ))}
    </ul>
  );
}
