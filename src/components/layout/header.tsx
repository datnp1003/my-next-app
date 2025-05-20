"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, UserCircle2 } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { getServerTranslations } from "@/i18n/i18n";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow-sm h-16">
      <div className="h-full px-8">
        <div className="flex h-full items-center justify-end gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserCircle2 className="h-8 w-8 text-blue-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getServerTranslations(locale)),
    },
  };
}