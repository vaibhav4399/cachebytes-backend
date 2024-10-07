import slowDown from "express-slow-down";

//** Rate Limit Configuration for the refresh Token path */

const refreshTokenRateLimit = slowDown({
    windowMs: 3 * 60 * 60 * 1000,
    delayAfter: 2,
    delayMs: (hits) => hits * 1000
})


export const rateLimiters = {
    refreshTokenRateLimit
}