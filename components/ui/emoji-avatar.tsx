import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface EmojiAvatarProps extends React.ComponentProps<typeof Avatar> {
  choosen_emoji: string;
  choosen_color?: string;
}

export function EmojiAvatar({
  choosen_emoji,
  choosen_color,
  className,
  ...props
}: EmojiAvatarProps) {
  return (
    <Avatar
      className={cn("flex items-center justify-center bg-muted", className)}
      style={{ backgroundColor: choosen_color }}
      {...props}
    >
      <span className="text-md leading-none select-none">{choosen_emoji}</span>
    </Avatar>
  );
}
