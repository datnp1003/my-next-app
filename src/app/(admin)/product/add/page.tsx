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

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { createProduct } from '@/core/domain/product/api';
import { getCategory } from '@/core/domain/category/api';
import { Select, SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';

const formSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().min(2).max(500),
  images: z.string().min(2).max(500),
  categoryId: z.number().min(1),
});

export default function AddProductPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Clear error when new files are dropped
    setError('');

    // Check for rejected files due to size
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
    onDropRejected: () => { } // Remove default error handling
  });




  const router = useRouter();
  const { t } = useTranslation('common');

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

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategory(),
  });

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const createProductFn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!files.length) return;

      setUploading(true);
      setError('');

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      let uploadedUrls: string[] = [];

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Upload failed');
        }

        //chuyển body từ json về dạng object
        const uploadData = await response.json().catch(() => null);
        if (!uploadData) throw new Error('Invalid server response');

        uploadedUrls = uploadData.files.map((i: any) => i.url) || [];
        setUploadedUrls(uploadedUrls);
        setFiles([]);
      } catch (err: any) {
        console.error('Upload error:', err);
        setError(err.message || 'Upload failed');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }

      //lấy danh sách url đã upload
      if (uploadedUrls.length === 0) {
        throw new Error('No files uploaded');
      }

      const createResponse = await createProduct({ name, price, description, images: uploadedUrls.join(','), categoryId } as any);

      if (!createResponse) {
        throw new Error('Failed to create product');
      }

      setAlert({ message: 'Thêm sản phẩm thành công.', type: 'success' });
      router.push('/product');
    } catch (error) {
      setAlert({ message: 'Có lỗi khi thêm sản phẩm. Vui lòng thử lại.', type: 'error' });
    }
  }

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json().catch(() => null);
      if (!data) throw new Error('Invalid server response');

      setUploadedUrls(data.files || []);
      setFiles([]);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('product.add_title')}</h2>
        {alert && (
          <div className={`mb-4 p-2 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {alert.message}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={createProductFn} className="space-y-4">
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
                          (cat: any) => cat.id === field.value
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
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <input {...getInputProps()} />
                    <p className="text-gray-600">
                      {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select'}
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Selected Files:</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {files.map((file, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={200}
                              height={200}
                              className="rounded-lg object-cover"
                            />
                            <button
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="mt-4 w-full"
                    >
                      {uploading ? 'Uploading...' : 'Upload Files'}
                    </Button> */}
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


