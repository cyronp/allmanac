import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="flex flex-col justify-center items-center w-full">
        <Text
          weight="extrabold"
          as="span"
          className="text-8xl tracking-tighter bg-linear-0 from-primary to-white bg-clip-text text-transparent"
        >
          404
        </Text>
        <Heading as="h1" className="text-xl text-primary tracking-tighter">
          Opss looks like we couldn't find this page...
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
