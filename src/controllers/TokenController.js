import { User } from "../models/index.js";

import { generateAccessToken } from "../helpers/token.js";

export async function refreshToken(req, res, next) {
    const { email } = req;
    const { refreshToken } = req.body;

    try {
        const user = await User.findOne({ where: { email, refreshToken } });

        if (user && refreshToken === user.refreshToken) {
            const { accessToken: newAccessToken } = generateAccessToken(email);
            res.json({ accessToken: newAccessToken });
        } else {
            res.status(403).json({ error: "Invalid Token" });
        }
    } catch (error) {
        next({ error, publicError: "Failed to refresh access token" });
    }
}
