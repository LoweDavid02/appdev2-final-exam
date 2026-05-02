import { Id } from "../convex/_generated/dataModel";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Todo: { userId: Id<"users"> };
};
