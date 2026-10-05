 import kwt from "jsonwebtoken";
 import User from "../models/user.model.js";

 export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Not authorized, invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Not authorized, user not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
