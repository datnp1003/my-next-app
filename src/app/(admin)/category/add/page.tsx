'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import React, { useState } from 'react';
import { createCategory } from '@/core/domain/category/api';

const formSchema = z.object({
  name: z.string().min(2).max(100),
});

export default function AddCategoryPage() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const [name, setName] = useState('');

  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const createCategoryFn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createCategory({ name } as any);

      if (!response) {
        throw new Error('Failed to create category');
      }

      const data = await response;
      setAlert({ message: 'Thêm danh mục thành công.', type: 'success' });
      router.push('/category');
    } catch (error) {
      setAlert({ message: 'Có lỗi khi thêm danh mục. Vui lòng thử lại.', type: 'error' });
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('category.add_title')}</h2>
        {alert && (
          <div className={`mb-4 p-2 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {alert.message}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={createCategoryFn} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">{t('category.name')}</FormLabel>
                  <Input type="text" {...field} value={name} onChange={(e) => { setName(e.target.value); field.onChange(e); }} required />
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


