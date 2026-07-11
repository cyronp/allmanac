import { Button } from "@/components/ui/button";

export default function AppPage() {
  return (
    <main className="flex flex-col justify-center items-center w-full h-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">App Dashboard</h2>
        <Button>
          Teste
        </Button>
      </div>
    </main>
  );
}
