'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function AddUserPage() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('user.add_title')}</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('user.name')}</label>
            <Input type="text" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t('user.password')}</label>
            <Input type="password" required />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t('action.cancel')}
            </Button>
            <Button
              type="submit"
              className="bg-sky-900 text-white hover:bg-sky-800"
            >
              {t('action.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
