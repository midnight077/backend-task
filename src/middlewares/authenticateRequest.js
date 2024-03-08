import jwt from "jsonwebtoken";

export function verifyRefreshToken(req, res, next) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        );
        req.email = decoded.email;
        next();
    } catch (error) {
        next({ error, publicError: "Failed to verify refresh token" });
    }
}

export function verifyAccessToken(req, res, next) {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.email = decoded.email;
        next();
    } catch (error) {
        next({ error, publicError: "Failed to verify access token" });
    }
}
