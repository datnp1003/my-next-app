'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

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
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
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
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}

        {uploadedUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Uploaded Files:</h3>
            <div className="grid grid-cols-3 gap-4">
              {uploadedUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
