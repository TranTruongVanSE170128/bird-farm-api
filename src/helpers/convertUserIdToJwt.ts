import jwt from 'jsonwebtoken';

export const convertUserIdToJwt = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
};
