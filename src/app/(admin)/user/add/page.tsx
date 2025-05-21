'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from '@tanstack/react-query';

import React, { useState } from 'react';
import { createUser } from '@/core/domain/user/api';

export default function AddUserPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const createUserFn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createUser({ name, email, password } as any);

      if (!response) {
        throw new Error('Failed to create user');
      }

      const data = await response;
      setAlert({ message: 'Thêm người dùng thành công.', type: 'success' });
      router.push('/user');
    } catch (error) {
      setAlert({ message: 'Có lỗi khi thêm người dùng. Vui lòng thử lại.', type: 'error' });
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('user.add_title')}</h2>
        <form>
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
              onClick={createUserFn}
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

