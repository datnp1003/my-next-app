import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

export function signToken(payload: string | Buffer | object, expiresIn: string = '1h') {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h', // đúng chỗ!
    algorithm: 'HS256'
  });
}


export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}