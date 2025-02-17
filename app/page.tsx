import AnimatedComponent from "@/components/AnimatedComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <AnimatedComponent>
      <div className="min-h-[calc(100dvh-80px)] flex justify-center items-center px-4 text-center">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="lg:text-4xl text-3xl font-bold">AI Image Generator</h1>
          <p className="text-neutral-400 lg:text-lg">
            Generate stunning images from text using AI{" "}
          </p>
          <Link href="/generate">
            <Button className="mt-2">Generate Image</Button>
          </Link>
        </div>
      </div>
    </AnimatedComponent>
  );
}
