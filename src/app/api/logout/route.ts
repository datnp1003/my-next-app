import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('token', '', { httpOnly: true, secure: true, maxAge: 0 });
    return response;
}