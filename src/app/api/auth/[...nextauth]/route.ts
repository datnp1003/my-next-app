import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
          return null;
        }

        // if (!user) {
        //   return null;
        // }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
session: {
    // strategy: SessionStrategy.JWT, // Sử dụng JWT cho session
    maxAge: 60 * 60, // Thời gian hết hạn session: 1 giờ (tính bằng giây)
  },
  // //set thời gian hết hạn cho access token
  jwt: {
    maxAge: 60 * 60 // Thời gian hết hạn JWT: 1 phút (tính bằng giây)
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };