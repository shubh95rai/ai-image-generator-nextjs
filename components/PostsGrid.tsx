"use client";

import { Post } from "@prisma/client";

import PostCard from "./PostCard";

export default function PostsGrid({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] justify-items-center">
          {posts.map((post: Post, index: number) => {
            return <PostCard post={post} index={index} key={post.id} />;
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No posts found</p>
      )}
    </div>
  );
}
