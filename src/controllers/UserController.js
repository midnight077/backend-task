import bcrypt from "bcrypt";

import { User } from "../models/index.js";

import { generateAuthTokens } from "../helpers/token.js";

export async function userRegister(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Login credentials required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const { accessToken, refreshToken } = generateAuthTokens(email);

        await User.create({
            email,
            password: hashedPassword,
            refreshToken: refreshToken,
        });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ error: "Failed to register" });
    }
}

export async function userLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Login credentials required" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateAuthTokens(user.email);
        await user.update({ refreshToken });
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: "Failed to login" });
    }
}

export async function userLogout(req, res) {
    try {
        const { email } = req;
        const user = await User.findOne({ where: { email } });

        if (
            !user ||
            !user.refreshToken ||
            user.refreshToken !== req.body.refreshToken
        ) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update({ refreshToken: null });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to logout" });
    }
}
