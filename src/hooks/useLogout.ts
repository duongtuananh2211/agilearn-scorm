// Utility to sign out the current user using Firebase Auth
import { signOut } from "firebase/auth";
import { useAuth } from "reactfire";

export function useLogout() {
  const auth = useAuth();
  return () => signOut(auth);
}
