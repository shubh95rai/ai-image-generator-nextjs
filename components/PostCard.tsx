import { Post } from "@prisma/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { LuDownload } from "react-icons/lu";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { AiOutlineDelete } from "react-icons/ai";
import { deletePostAction } from "@/actions/actions";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export default function PostCard({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  async function handleDeletePost(id: string) {
    const result = await deletePostAction(id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function downloadImage(imageUrl: string, prompt: string) {
    try {
      const response = await fetch(imageUrl);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Extract filename from URL
      const promptSplit = prompt.split(" ");
      const fileName = promptSplit.join("_");

      // Extract the file extension from the blob's
      const imageExt = blob.type.split("/")[1];

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName}.${imageExt}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      toast.success("Image downloaded successfully!");

      // const link = document.createElement("a");
      // link.href = imageUrl;
      // link.target = "_blank";
      // link.download = new Date().getTime().toString();
      // link.click();
    } catch (error) {
      console.error("Failed to download image:", error);

      toast.error("Failed to download image!");
    }
  }

  const [open, setOpen] = useState(false);

  const refElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    function close(e: Event) {
      if (!refElement.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (window.innerWidth < 1024) {
      window.addEventListener("mousedown", close);
    }

    return () => {
      window.removeEventListener("mousedown", close);
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.35,
          delay: index * 0.1,
        },
      }}
      className="flex flex-col border p-4 rounded-lg gap-4"
      key={post.id}
    >
      <Image
        src={post.imageUrl}
        alt="Post"
        width={450}
        height={450}
        className="rounded-lg"
        priority
      />
      <div className="text-muted-foreground text-sm flex justify-between items-center gap-2">
        {/* tooltip for viewport above 1024px */}
        <div className="hidden lg:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="line-clamp-1 cursor-default text-start">
                  {post.prompt}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="max-w-64">
                <p>{post.prompt}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* tooltip on tap for viewport tabs and mobile devices */}
        <div className="lg:hidden">
          <div
            onClick={() => {
              setOpen(!open);
            }}
            ref={refElement}
          >
            <p
              className={`${
                open ? "line-clamp-none" : "line-clamp-1"
              } cursor-default text-start`}
            >
              {post.prompt}
            </p>
          </div>
          {/* {open && (
            <div className="top-8 max-w-xl bg-background p-2 absolute border rounded-lg">
              <p>{post.prompt}</p>
            </div>
          )} */}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant={"outline"}
            size={"icon"}
            className="flex-none"
            onClick={() => {
              handleDeletePost(post.id);
            }}
          >
            <AiOutlineDelete />
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            className="flex-none"
            onClick={() => {
              downloadImage(post.imageUrl, post.prompt);
            }}
          >
            <LuDownload />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
