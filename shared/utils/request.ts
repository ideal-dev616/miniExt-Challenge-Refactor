import { IncomingMessage } from 'http';

/**
 * Extract and returns clientIp information from request object.
 */
export const getClientIp = (request: IncomingMessage) => {
    // If running in serverless, the client IP is stored in the header.
    const ip = request.headers['x-real-ip'] ?? request.socket.remoteAddress;

    return Array.isArray(ip) ? ip[0] : ip;
};

/**
 * Extract and returns userAgent information from request object.
 */
export const getUserAgent = (request: IncomingMessage) => {
    const userAgent =
        (request.headers['user-agent'] as string | undefined) ??
        navigator.userAgent;

    return userAgent;
};
