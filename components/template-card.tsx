"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

// Define the props the component expects
interface TemplateCardProps {
  title: string;
  thumbnail: string;
  subtitle: string;
  route: string;
}

export function TemplateCard({
  title,
  thumbnail,
  subtitle,
  route,
}: TemplateCardProps) {
  const router = useRouter();
  return (
    <div className="bg-[#181818] w-[35vw] xxl:w-[25vw] rounded-lg border-white/[0.1] border">
      <div className="px-5 flex space-x-7 h-full mr-4">
        <div className="w-[40%] min-h-[150px] my-5 flex items-center aspect-square relative">
          <Image
            src={thumbnail} // Using the dynamic thumbnail prop
            alt={title} // Using the title for the alt text
            className="rounded-2xl object-cover"
            fill
            sizes="100vw"
          />
        </div>

        <div className="w-[60%] pt-5 pb-4 my-1 flex flex-col">
          <div className="h-full flex flex-col">
            <h1 className="font-bold font-sans mb-2 text-lg 2xl:text-xl">
              {title}
            </h1>
            <h1 className="font-sans text-lg line-clamp-3 2xl:line-clamp-4">
              {subtitle}
            </h1>
            <Button
              size="sm"
              className="mt-auto"
              onClick={() => router.push(route)}
            >
              Try it out <ArrowRight className="w-3 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
