import AnimatedComponent from "@/components/AnimatedComponent";
import GenerateContent from "@/components/GenerateContent";

export default function GeneratePage() {
  return (
    <AnimatedComponent>
      <div className="min-h-[calc(100vh-64px)] px-4 flex flex-col items-center">
        {/* <div className="py-10 text-center space-y-2">
          <h1 className="lg:text-4xl text-3xl font-bold ">Generate Image</h1>
          <p className="text-neutral-400 lg:text-lg">
            Generate stunning images from text for free
          </p>
        </div> */}

        <GenerateContent />
      </div>
    </AnimatedComponent>
  );
}
