import { CyclingText } from "@/components/ui/cycling-text";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import GoogleIcon from "@/components/icons/google-icon";
import GithubIcon from "@/components/icons/github-icon";

export default function Home() {
  const words = ["tasks", "goals", "hobbies"];
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background px-4">
      <div className="flex flex-col justify-center items-center bg-card w-full min-w-70 max-w-105 sm:max-w-120 px-5 sm:px-6 py-8 rounded-lg">
        <header className="flex flex-col items-center gap-3 w-full">
          <Heading
            as="h1"
            className="text-2xl sm:text-3xl tracking-tight leading-tight font-semibold text-center"
          >
            Welcome to
            <br />
            <Text
              as="span"
              className="text-primary text-2xl sm:text-3xl tracking-tighter font-extrabold text-center"
            >
              allmanac
            </Text>
          </Heading>
          <Text
            as="p"
            className="inline-flex gap-1 w-full items-center justify-center text-muted-foreground font-medium text-lg"
          >
            Start your journey now and organized your
            <CyclingText
              words={words}
              className="text-transparent bg-clip-text bg-linear-90 from-primary to-lime-100"
            />
          </Text>
          <Separator />
          <Button className="w-full h-11 sm:h-12 rounded-full" variant="outline" asChild>
            <Link href="/dashboard">
              <GoogleIcon /> Login with Google
            </Link>
          </Button>
          <Button className="w-full h-11 sm:h-12 rounded-full" variant="outline" asChild>
            <Link href="/dashboard">
              <GithubIcon /> Login with Github
            </Link>
          </Button>
        </header>
      </div>
    </div>
  );
}
