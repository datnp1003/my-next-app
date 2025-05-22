'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/core/domain/product/product.model';
import { getProductById, updateProduct } from '@/core/domain/product/api';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategory } from '@/core/domain/category/api';
import { useDropzone } from 'react-dropzone';

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

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    if (rejectedFiles.length > 0) {
      const sizeErrors = rejectedFiles.filter(file => file.file.size > 5 * 1024 * 1024);
      if (sizeErrors.length > 0) {
        setError(`File size exceeds 100KB limit`);
        return;
      }
    }
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => { }
  });

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

  const { data: productData, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategory(),
  });

  useEffect(() => {
    if (productData) {
      setName(productData.name || '');
      setPrice(productData.price || 0);
      setDescription(productData.description || '');
      setImages(productData.images || '');
      setCategoryId(productData.categoryId || 0);
      setOldImages(productData.images ? productData.images.split(',').filter((x: string) => x) : []);
    }
  }, [productData]);

  const handleRemoveOldImage = (index: number) => {
    setOldImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateProductFn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedUrls: string[] = [];

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Upload failed');
        const uploadData = await response.json().catch(() => null);
        if (!uploadData) throw new Error('Invalid server response');
        uploadedUrls = uploadData.files.map((i: any) => i.url) || [];
      }

      const allImages = [...oldImages, ...uploadedUrls];
      await updateProduct(+id, { name, price, description, images: allImages.join(','), categoryId });
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
                  {oldImages.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Ảnh hiện tại:</h3>
                      <div className="flex gap-4 flex-wrap">
                        {oldImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <Image
                              src={img}
                              alt={`old-img-${idx}`}
                              width={120}
                              height={120}
                              className="rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOldImage(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    <p className="text-gray-600">
                      {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select'}
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Ảnh mới:</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {files.map((file, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={120}
                              height={120}
                              className="rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="mt-4 text-red-500">{error}</p>
                  )}
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
                className="bg-sky-900 text-white hover:bg-sky-800"
              >
                {t('action.save')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

