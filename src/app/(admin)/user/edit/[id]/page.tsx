'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { updateUser, getUserById } from '@/core/domain/user/api';
import { User } from '@prisma/client';
import { UserVM } from '@/core/domain/user/user.model';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation('common');
  const id = params.id as string;

  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
      },
    });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Lấy thông tin user hiện tại
  const { data: userData, isLoading } = useQuery<UserVM>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

  // Set dữ liệu user vào state khi fetch xong
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

  // Hàm update user
  const updateUserFn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(+id, { name, email, password });
      setAlert({ message: 'Cập nhật người dùng thành công.', type: 'success' });
      router.push('/user');
    } catch (error) {
      setAlert({ message: 'Có lỗi khi cập nhật người dùng. Vui lòng thử lại.', type: 'error' });
    }
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('user.edit_title')}</h2>
        {alert && (
          <div className={`mb-4 p-2 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {alert.message}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={updateUserFn} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">{t('user.name')}</FormLabel>
                  <Input type="text" {...field} value={name} onChange={(e) => { setName(e.target.value); field.onChange(e); }} required />
                </FormItem>
              )}
            />

          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-1">{t('user.email')}</FormLabel>
                <Input type="email" {...field} value={email} onChange={(e) => { setEmail(e.target.value); field.onChange(e); }} required />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-1">{t('user.password')}</FormLabel>
                <Input type="password" {...field} value={password} onChange={(e) => { setPassword(e.target.value); field.onChange(e); }} />
              </FormItem>
            )}
          />

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
              className="bg-sky-900 text-white hover:bg-sky-800"            >
              {t('action.save')}
            </Button>
          </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

