'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
// Update the import path below if your LanguageSwitcher is located elsewhere
import LanguageSwitcher from "../../components/layout/LanguageSwitcher";
import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';


export default function LoginPage() {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const isClient = session?.user?.role === 'CLIENT';

  useEffect(() => {
    if (session && isClient) {
      router.push('/client');
    }
    else if (session && !isClient) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Email hoặc mật khẩu không đúng');
    } else {
      router.replace(redirectUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <LanguageSwitcher />
        <h1 className="text-2xl font-bold mb-6 text-center">{t('login.title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('login.username')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {t('login.submit')}
          </button>
          <div className="text-center mt-4 hover:text-blue-500">
            <a href="/register">{t('login.register_link')}</a>
          </div>
        </form>
      </div>
    </div>
  );
}