import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ArrowRight, SquareDashed, Sparkles, Target, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-background text-foreground selection:bg-primary/30">
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
        <Link href="/home">
          <Button variant="outline" size="default">
            Go to App <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </header>
    </div>
  );
}
