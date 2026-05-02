import { ConvexProvider, ConvexReactClient } from "convex/react";
import TodoScreen from "./screens/TodoScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { useState } from "react";

import { Id } from "./convex/_generated/dataModel";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

type Screen = 'login' | 'signup' | 'todo';

export default function App() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const handleLogin = (id: Id<"users">) => {
    setUserId(id);
    setCurrentScreen('todo');
  };

  const handleSignupSuccess = () => {
    setCurrentScreen('login');
  };

  const navigateToSignup = () => {
    setCurrentScreen('signup');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <ConvexProvider client={convex}>
      {currentScreen === 'todo' && userId ? (
        <TodoScreen userId={userId} />
      ) : currentScreen === 'signup' ? (
        <SignupScreen onSignupSuccess={handleSignupSuccess} />
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignup={navigateToSignup} />
      )}
    </ConvexProvider>
  );
}
