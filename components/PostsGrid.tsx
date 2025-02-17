"use client";

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

export default function PostsGrid({ posts }: { posts: Post[] }) {
  async function handleDeletePost(id: string) {
    const result = await deletePostAction(id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function downloadImage(imageUrl: string) {
    try {
      // const response = await fetch(imageUrl);
      // const blob = await response.blob();
      // const blobUrl = URL.createObjectURL(blob);

      // const link = document.createElement("a");
      // link.href = blobUrl;
      // link.download = new Date().toString();

      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      // URL.revokeObjectURL(blobUrl);

      const link = document.createElement("a");
      link.href = imageUrl;
      link.target = "_blank";
      link.download = new Date().getTime().toString();
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);

      toast.error("Failed to download image!");
    }
  }
  return (
    <div>
      {posts.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] justify-items-center">
          {posts.map((post: Post, index: number) => {
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
                className="flex flex-col border  p-4 rounded-lg gap-4"
                key={post.id}
              >
                <Image
                  src={post.imageUrl}
                  alt="Post"
                  width={450}
                  height={450}
                  className="rounded-lg"
                />
                <div className="text-muted-foreground text-sm flex  justify-between items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="line-clamp-1 cursor-default text-start">
                          {post.prompt}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="start"
                        className="max-w-64"
                      >
                        <p>{post.prompt}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

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
                        downloadImage(post.imageUrl);
                      }}
                    >
                      <LuDownload />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No posts found</p>
      )}
    </div>
  );
}
