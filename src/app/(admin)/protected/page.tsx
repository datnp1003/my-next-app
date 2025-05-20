'use server'
import SignOutButton from "@/components/layout/SignOutButton";
import { GetTranslation } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { t } = await GetTranslation('common');
  /**
   
getServerSession chỉ thực hiện trên server
không dùng use client được,
tạo riêng button đăng xuất,
để có thể dùng use client*/
const session = await getServerSession();

  if (!session) {
    redirect('/login?redirect=/protected');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{t('protected.title')}</h1>
        <p>{t('protected.content')} {session.user?.name || session.user?.email}!</p>
        <SignOutButton />
      </div>
    </div>
  );
}