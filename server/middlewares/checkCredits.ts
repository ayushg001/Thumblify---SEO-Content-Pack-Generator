import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import plans from '../config/plans.js';

const checkCredits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User session not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Auto-reset monthly credits if reset date has passed
        if (new Date() > new Date(user.creditsResetAt)) {
            const planCredits = plans[user.plan]?.credits || plans.free.credits;
            user.credits = planCredits;

            const nextReset = new Date();
            nextReset.setMonth(nextReset.getMonth() + 1);
            user.creditsResetAt = nextReset;

            await user.save();
        }

        if (user.credits <= 1) {
            return res.status(403).json({ message: "Not sufficient credits" });
        }

        next();
    } catch (error: any) {
        console.error("Error in checkCredits middleware:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export default checkCredits;