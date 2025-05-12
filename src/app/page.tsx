import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ModeToggle } from "@/components/mode-toggle";
import { CodeXml } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col font-sans gap-5">
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
      <div className="flex-1 container mx-auto p-4 max-w-7xl rounded-md flex flex-col">
          <Tabs defaultValue="code" className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="code" className="text-md cursor-pointer">Code</TabsTrigger>
          <TabsTrigger value="explanation" className="text-md cursor-pointer">Explanation</TabsTrigger>
        </TabsList>
          </Tabs>
        <div className="grid grid-cols-2 gap-4 h-full flex-1">
          <Card className="p-4 flex items-center justify-center text-muted-foreground hover:shadow-md cursor-pointer">Paste your code snippets here</Card>
          <Card className="p-4 flex items-center justify-center text-muted-foreground hover:shadow-md cursor-pointer">Explanation</Card>
        </div>
      </div>
    </div>
  );
}
