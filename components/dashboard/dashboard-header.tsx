import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface DashboardHeaderProps {
  username: string;
}

export default function DashboardHeader({
  username,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col">
      <Heading as="h1" className="text-4xl tracking-tight">
        Good to see you {username}! 👋
      </Heading>
      <Text
        as="span"
        className="text-lg text-muted-foreground tracking-tighter"
      >
        {"Let's"} have a better life cycle together!
      </Text>
    </header>
  );
}
