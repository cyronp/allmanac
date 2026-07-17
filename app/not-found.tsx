import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen max-h-screen overflow-hidden gap-4">
      <div className="absolute -z-10 pointer-events-none h-96 w-[120%] blur-[120px] rounded-full bg-linear-180 from-accent/80 to-primary -bottom-20 opacity-40 " />
      <div className="flex flex-col justify-center items-center w-full">
        <Text
          weight="extrabold"
          as="span"
          className="text-8xl tracking-tighter bg-linear-0 from-primary to-white bg-clip-text text-transparent"
        >
          404
        </Text>
        <Heading as="h1" className="text-xl text-primary tracking-tighter">
          Opss looks like we {"couldn't"} find this page...
        </Heading>
      </div>
      <Button asChild variant="outline" size="lg">
        <Link href="/">
          <ArrowLeft /> Go back home
        </Link>
      </Button>
    </div>
  );
}
