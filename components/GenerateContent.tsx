"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSchema, TFormSchema } from "@/schemas/schemas";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import Image from "next/image";
import { generateImageAction } from "@/actions/actions";
import { toast } from "sonner";
import Link from "next/link";

export default function GenerateContent() {
  const [outputImage, setOutputImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(data: TFormSchema) {
    try {
      setIsLoading(true);

      const result = await generateImageAction(data);

      if (!result.success) {
        setIsLoading(false);

        toast.error(result.message);
      }

      const image = new window.Image();
      image.src = result.imageUrl as string;

      image.onload = () => {
        setOutputImage(image.src);
      };
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong. Please try again later");

      setIsLoading(false);
    }
  }
  return (
    <div className="grid lg:grid-cols-2 flex-1 h-full w-full items-center py-8 gap- lg:gap-0">
      <div className="lg:border-r h-full place-content-center lg:px-8">
        <div className="lg:max-w-xl sm:max-w-md max-w-sm mx-auto space-y-4">
          <p className="text-neutral-400 text-center">
            Type your prompt below to create an image!
          </p>
          <form
            className="flex items-center gap-2 relative"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              placeholder="a cat sitting over a sofa"
              {...register("prompt")}
            />
            <p className="absolute top-11 left-3 text-sm text-red-600">
              {errors.prompt?.message}
            </p>

            <div className="min-w-[120px]">
              <LoadingButton pending={isLoading}>Generate</LoadingButton>
            </div>
          </form>
        </div>
      </div>
      <div className="mx-auto border bg-primary/5 rounded-lg lg:size-[450px] sm:size-96 size-80 aspect-square flex items-center justify-center overflow-hidden">
        {outputImage ? (
          <Link href="/profile">
            <Image
              src={outputImage}
              alt="generated image"
              width={450}
              height={450}
              onLoad={() => {
                setIsLoading(false);
              }}
            />
          </Link>
        ) : (
          <div className="text-neutral-500 text-">
            Enter your prompt and Hit Generate!
          </div>
        )}
      </div>
    </div>
  );
}
