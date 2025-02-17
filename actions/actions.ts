"use server";

import { TFormSchema } from "@/schemas/schemas";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { revalidatePath } from "next/cache";

export async function getSessionAction() {
  const session = await auth();

  return session;
}

export async function loginAction() {
  await signIn("google");
}

export async function logoutAction() {
  await signOut();
}

export async function generateImageAction(data: TFormSchema) {
  const session = await getSessionAction();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to generate an image",
    };
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (!userExists) {
    return {
      success: false,
      message: "User does not exist",
    };
  }

  const randomSeed = Math.ceil(Math.random() * 100000);

  const imageUrl = `https://image.pollinations.ai/prompt/${data.prompt}?width=1024&height=1024&seed=${randomSeed}&model=flux&nologo=true`;

  await prisma.post.create({
    data: {
      prompt: data.prompt,
      imageUrl: imageUrl,
      seed: randomSeed,
      user: {
        connect: {
          email: userExists.email as string,
        },
      },
    },
  });

  return {
    success: true,
    message: "Image generated successfully",
    imageUrl: imageUrl,
  };
}

export async function getPostsAction() {
  const session = await getSessionAction();

  const posts = await prisma.post.findMany({
    where: {
      user: {
        email: session?.user?.email as string,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}

export async function deletePostAction(id: string) {
  try {
    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/profile");

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, messsage: "Error deleteing the posts" };
  }
}
