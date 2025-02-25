import { getPostsAction, getSessionAction } from "@/actions/actions";
import PostsGrid from "@/components/PostsGrid";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSessionAction();

  if (!session) {
    redirect("/");
  }
  const posts = await getPostsAction();

  return (
    <div className="min-h-[calc(100vh-64px)] p-4">
      <PostsGrid posts={posts} />
    </div>
  );
}
