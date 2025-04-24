export { AuthProvider } from "./AuthProvider";
export { useAuth } from "./useAuth";
export type { User } from "./auth.context";
export * from "./actions";
export * from "./api";
export { toUser } from "./helpers/user";
export * from "./InjectAuthToServer";
export {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
  getTokens,
} from "next-firebase-auth-edge";
export { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
export {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  updateProfile,
  updateEmail,
  onAuthStateChanged,
  EmailAuthProvider,
  signInWithCustomToken,
} from "firebase/auth";
export type { User as FbUser } from "firebase/auth";
