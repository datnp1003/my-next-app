'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';

import React, { useState } from 'react';

export default function AddUserPage() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //viết hàm gọi đến api.ts add user
  const { data, isLoading, error } = useQuery({
    queryKey: ['addUser'],
    queryFn: async () => {
      const res = await fetch('/api/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: '', email: '', password: '' }),
      });
      return res.json();
    },
  });
  
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('user.add_title')}</h2>

          <div>
            <label className="block text-sm font-medium mb-1">{t('user.password')}</label>
            <Input type="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('user.email')}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t('user.password')}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
function addUser(arg0: { email: any; password: any; name: void; }): any {
  throw new Error('Function not implemented.');
}

