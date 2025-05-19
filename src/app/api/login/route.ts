// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import prisma from '@/lib/prisma';
// import { signToken } from '@/lib/jwt';

// export async function POST(req: NextRequest) {
//     try {
//         const { email, password } = await req.json();
//         if (!email || !password) {
//             return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
//         }

//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user) {
//             return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
//         }

//         const token = signToken({ id: user.id, email: user.email });
//         const response = NextResponse.json({ message: 'Login successful' });
//         response.cookies.set('token', token, { httpOnly: true, secure: true, maxAge: 3600 });
//         return response;
//     } catch (error) {
//         return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
//     }
// }