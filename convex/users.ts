import { mutation } from "./_generated/server"
import { v } from "convex/values"
import bcrypt from "bcryptjs"

export const login = mutation({
    args: {
        username: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
            .filter((q) => q.eq(q.field("username"), args.username))
            .unique();

        if (!user) {
            return { success: false, message: "User not found!" }
        }

        const passwordCorrect = bcrypt.compareSync(args.password, user.password)

        if (!passwordCorrect) {
            return { success: false, message: "Invalid credentials!" }
        }

        return {
            success: true,
            userId: user._id
        }
    }
})

export const register = mutation({
    args: {
        fullname: v.string(),
        username: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        // Validate fullname
        if (!args.fullname || args.fullname.trim().length === 0) {
            return { success: false, message: "Full name cannot be empty!" };
        }

        if (args.fullname.length > 100) {
            return { success: false, message: "Full name is too long (max 100 characters)!" };
        }

        // Validate username
        if (!args.username || args.username.trim().length === 0) {
            return { success: false, message: "Username cannot be empty!" };
        }

        // Validate password
        if (!args.password || args.password.length < 6) {
            return { success: false, message: "Password must be at least 6 characters!" };
        }

        // Check if user already exists
        const existingUser = await ctx.db.query("users")
            .filter((q) => q.eq(q.field("username"), args.username))
            .unique();

        if (existingUser) {
            return { success: false, message: "User already exists!" };
        }

        // Hash password and create user
        const hashedPassword = bcrypt.hashSync(args.password, 10);

        const userId = await ctx.db.insert("users", {
            fullname: args.fullname.trim(),
            username: args.username.trim(),
            password: hashedPassword
        });

        return {
            success: true,
            userId: userId,
            message: "Account created successfully!"
        };
    }
})