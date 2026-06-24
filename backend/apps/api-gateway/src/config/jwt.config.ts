export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'secret-key',

  expiresIn: '15m',
};
