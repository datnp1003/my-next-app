import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

// Định nghĩa kiểu cho user
interface User {
    id: string;
    name: string | null;
    email: string | null;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        }
    }
};
// ...existing code...
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
// ...existing code...