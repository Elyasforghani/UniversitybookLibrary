import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const Header = async ({ session }: { session?: Session }) => {
  let isAdmin = (session?.user as any)?.role === "ADMIN";

  if (!isAdmin && session?.user?.id) {
    const user = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    isAdmin = user[0]?.role === "ADMIN";
  }

  return (
    <header className="my-10 flex justify-between items-center gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-4 sm:gap-6">
        {isAdmin && (
          <li>
            <Link href="/admin">
              <Button className="bg-amber-100 hover:bg-amber-200 text-dark-100 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border border-amber-300 shadow-sm cursor-pointer">
                <Image
                  src="/icons/admin/logo.svg"
                  alt="admin"
                  width={20}
                  height={20}
                />
                Admin Portal
              </Button>
            </Link>
          </li>
        )}

        {session?.user && (
          <li className="flex items-center gap-3">
            <Link href="/my-profile" className="flex items-center gap-2">
              <Avatar className="size-9">
                <AvatarFallback className="bg-amber-100 text-dark-200 font-bold text-sm">
                  {getInitials(session.user.name || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-light-100 text-sm font-medium hidden sm:inline">
                {session.user.name}
              </span>
            </Link>
          </li>
        )}

        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              variant="outline"
              className="text-light-100 border-light-400 hover:bg-white/10"
            >
              Logout
            </Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
