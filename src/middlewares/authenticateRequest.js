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
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ error: "Refresh token expired" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ error: "Invalid refresh token" });
        } else {
            return res
                .status(500)
                .json({ error: "Failed to verify refresh token" });
        }
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
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ error: "Access token expired" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ error: "Invalid access token" });
        } else {
            return res
                .status(500)
                .json({ error: "Failed to verify access token" });
        }
    }
}
