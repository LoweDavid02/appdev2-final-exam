import { mutation } from "./_generated/server";

export const addFullnameToExistingUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    let updatedCount = 0;
    for (const user of users) {
      if (!user.fullname) {
        await ctx.db.patch(user._id, {
          fullname: "User " + user.username,
        });
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} users with default fullname`);
    return {
      success: true,
      message: `Updated ${updatedCount} users`,
      updatedCount,
    };
  },
});
