'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/core/domain/product/product.model';
import { getProductById, updateProduct } from '@/core/domain/product/api';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategory } from '@/core/domain/category/api';

const formSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().min(2).max(500),
  images: z.string().min(2).max(500),
  categoryId: z.number().min(1),
});

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation('common');
  const id = params.id as string;

  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        price: 0,
        description: '',
        images: '',
        categoryId: 0,
      },
    });

  const [name, setName] = useState(''); 
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Lấy thông tin product hiện tại
  const { data: productData, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategory(),
  });

  // Set dữ liệu product vào state khi fetch xong
  useEffect(() => {
    if (productData) {
      setName(productData.name || '');
      setPrice(productData.price || 0);
      setDescription(productData.description || '');
      setImages(productData.images || '');
      setCategoryId(productData.categoryId || 0);
    }
  }, [productData]);

  // Hàm update product
  const updateProductFn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct(+id, { name, price, description, images, categoryId });
      setAlert({ message: 'Cập nhật sản phẩm thành công.', type: 'success' });
      router.push('/product');
    } catch (error) {
      setAlert({ message: 'Có lỗi khi cập nhật sản phẩm. Vui lòng thử lại.', type: 'error' });
    }
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('product.edit_title')}</h2>
        {alert && (
          <div className={`mb-4 p-2 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {alert.message}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={updateProductFn} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">{t('product.name')}</FormLabel>
                  <Input type="text" {...field} value={name} onChange={(e) => { setName(e.target.value); field.onChange(e); }} required />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">{t('product.price')}</FormLabel>
                  <Input type="number" {...field} value={price} onChange={(e) => { setPrice(Number(e.target.value)); field.onChange(e); }} required />
                </FormItem>
              )}

            />

            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">{t('product.description')}</FormLabel>
                  <Input type="text" {...field} value={description} onChange={(e) => { setDescription(e.target.value); field.onChange(e); }} />
                </FormItem>
              )}

            />
            
            <FormField
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('product.category')}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setCategoryId(Number(value));
                      field.onChange(Number(value));
                    }}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue>
                        {categoriesData?.find(
                          (cat: any) => cat.id === categoryId
                        )?.name || "Chọn danh mục"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {categoriesData?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">{t('product.images')}</FormLabel>
                  <Input type="text" {...field} value={images} onChange={(e) => { setImages(e.target.value); field.onChange(e); }} />
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

