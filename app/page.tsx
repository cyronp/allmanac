import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  ArrowRight,
  SquareDashed,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Radial glow 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        {/* Radial glow 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="inline-flex gap-2.5 items-center select-none">
          <SquareDashed className="text-primary" size={28} />
          <Text
            as="span"
            className="text-primary text-2xl tracking-tighter font-extrabold"
          >
            allmanac
          </Text>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="default">
            Go to App <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </header>
    </div>
  );
}
