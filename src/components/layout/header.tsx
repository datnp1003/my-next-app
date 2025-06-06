"use client";

import { Button } from "@/components/ui/button";
import { Bell, UserCircle2 } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 bg-white shadow-sm h-16 z-40">
      <div className="h-full px-16 md:px-8">
        <div className="flex h-full items-center justify-end gap-2">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle2 className="text-blue-500" style={{ width: 20, height: 20 }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-8">
              <DropdownMenuItem>
                Hello, {session?.user?.name}!
              </DropdownMenuItem>
              <DropdownMenuItem>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// export async function getServerSideProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await getServerTranslations(locale)),
//     },
//   };
// }