import { mutation } from "./_generated/server";
import * as bcrypt from "bcryptjs";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // STEP 1: Create or get a test user
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), "testuser"))
      .unique();

    let userId;
    if (existingUser) {
      userId = existingUser._id;
      console.log("Using existing test user:", userId);
    } else {
      const hashedPassword = bcrypt.hashSync("password123", 10);
      userId = await ctx.db.insert("users", {
        username: "testuser",
        password: hashedPassword,
      });
      console.log("Created new test user:", userId);
    }

    // STEP 2: Generate realistic todo tasks
    const initialTasks = [
      { text: "Buy groceries for the week", isCompleted: false },
      { text: "Finish React Native tutorial", isCompleted: true },
      { text: "Clean the kitchen and living room", isCompleted: false },
      { text: "Call mom to check in", isCompleted: false },
      { text: "Schedule dentist appointment", isCompleted: true },
      { text: "Fix bug in todo app", isCompleted: false },
      { text: "Read 10 pages of a book", isCompleted: true },
      { text: "Go for a 20-minute run", isCompleted: false },
      { text: "Organize desk and workspace", isCompleted: false },
      { text: "Meditate for 5 minutes", isCompleted: true },
      { text: "Review pull requests on GitHub", isCompleted: false },
      { text: "Prepare presentation slides", isCompleted: false },
    ];

    // STEP 3: Insert todos with proper userId reference
    for (const task of initialTasks) {
      await ctx.db.insert("todos", {
        text: task.text,
        isCompleted: task.isCompleted,
        userId: userId,
      });
    }

    console.log(`Successfully seeded ${initialTasks.length} tasks for user ${userId}!`);
    return {
      success: true,
      message: `Successfully seeded ${initialTasks.length} tasks!`,
      userId: userId,
      tasksCount: initialTasks.length,
    };
  },
});
