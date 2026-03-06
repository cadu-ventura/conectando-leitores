export const JWT_CONSTANTS = {
    secret: process.env.TOKEN_SECRET || 'ANY_SECRET_KEY',
    expiresIn: process.env.TOKEN_EXPIRATION || '24h'
}