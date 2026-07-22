import { PowerOnSequence } from "@/components/power-on-sequence";
import { Rack } from "@/components/rack";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <PowerOnSequence />
      <Rack />
    </main>
  );
}
