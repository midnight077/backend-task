import jwt from "jsonwebtoken";

export function generateAuthTokens(email) {
    const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
}
