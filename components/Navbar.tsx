import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { loginAction, logoutAction } from "@/actions/actions";
import { auth } from "@/auth";
import { Avatar } from "./ui/avatar";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();
  // console.log(session);

  return (
    <nav className="sticky top-0 bg-background w-full border-b h-[80px] px-4 flex justify-between items-center">
      <Link href="/" className="hidden sm:block text-xl font-bold">
        AI Image Generator
      </Link>
      <Link href="/" className="sm:hidden text-xl font-bold">
        AI Image
      </Link>
      <div className="flex gap-2 items-center ">
        {session && (
          <Link href="/profile">
            <Avatar className="size-8">
              <Image
                src={session?.user?.image || ""}
                width={40}
                height={40}
                alt="profile picture"
              />
            </Avatar>
          </Link>
        )}

        <ModeToggle />

        {!session ? (
          <form action={loginAction}>
            <Button variant={"outline"}>Log in</Button>
          </form>
        ) : (
          <form action={logoutAction}>
            <Button variant={"outline"}>Log out</Button>
          </form>
        )}
      </div>
    </nav>
  );
}
