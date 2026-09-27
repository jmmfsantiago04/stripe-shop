import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "admin-session";


function getSessionSecret() {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
        throw new Error("ADMIN_SESSION_SECRET nao configurada");
    }
    return secret;
}

export function getAdminPassword() {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
        throw new Error("ADMIN_PASSWORD nao configurada");
    }
    return password;
}

export function createAdminSessionToken() {
    return createHmac("sha256", getSessionSecret()).update("stripe-shop-admin-v1")
    .digest("hex");
}

export function verifyAdminSessionToken(token: string | undefined) {
    if (!token) return false;
    const expected = createAdminSessionToken();
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
    }

    export function verifyAdminPassword(password: string) {
        const expected = getAdminPassword();
        const a = Buffer.from(password);
        const b = Buffer.from(expected);
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    }