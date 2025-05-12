import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ModeToggle } from "@/components/mode-toggle";
import { CodeXml } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-full font-sans">
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full mt-5 px-4">
          <div className="flex-1"></div>
          <AnimatedShinyText className="flex items-center justify-center gap-3 text-6xl font-semibold tracking-tight">
            <CodeXml size={60} />
            WikiCode
          </AnimatedShinyText>
          <div className="flex-1 flex justify-end">
            <ModeToggle />
          </div>
        </div>
      <div className="text-muted-foreground mt-2 ml-6 text-lg italic ">
        A simple wiki for all your code explanations
      </div>
      </div>
      <div className="w-full"> hi</div>
    </div>
  );
}
