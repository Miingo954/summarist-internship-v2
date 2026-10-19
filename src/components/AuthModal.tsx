"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, getRedirectResult, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { closeAuth, loginGuest, loginWithEmail, setAuthMode } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getFirebaseAuth } from "@/lib/firebase";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authOpen, authMode } = useAppSelector((state) => state.ui);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.body.style.overflow = authOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [authOpen]);

  useEffect(() => {
    getRedirectResult(getFirebaseAuth())
      .then((credential) => {
        if (!credential) return;
        dispatch(loginWithEmail(credential.user.email || "Google user"));
        dispatch(closeAuth());
        router.push("/for-you");
      })
      .catch((error) => setMessage(authError(error)));
  }, [dispatch, router]);

  if (!authOpen) return null;

  const finish = (email: string) => { dispatch(loginWithEmail(email)); dispatch(closeAuth()); router.push("/for-you"); };
  const authError = (error: unknown) => {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code.includes("invalid-credential") || code.includes("user-not-found")) return "Email or password is incorrect.";
    if (code.includes("email-already-in-use")) return "An account already exists with this email.";
    if (code.includes("weak-password")) return "Password must be at least 6 characters.";
    if (code.includes("invalid-email")) return "Enter a valid email address.";
    return "Authentication could not be completed. Please try again.";
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    if (!email || password.length < 6) return setMessage("Enter a valid email and a password with at least 6 characters.");
    setBusy(true); setMessage("");
    try {
      const auth = getFirebaseAuth();
      const credential = authMode === "register"
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      finish(credential.user.email || email);
    } catch (error) { setMessage(authError(error)); }
    finally { setBusy(false); }
  };
  const googleLogin = async () => {
    setBusy(true); setMessage("");
    try { await signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider()); }
    catch (error) { setMessage(authError(error)); }
    finally { setBusy(false); }
  };
  const resetPassword = async () => {
    const input = document.querySelector<HTMLInputElement>('.auth-modal input[name="email"]');
    const email = input?.value.trim() || "";
    if (!email) return setMessage("Enter your email above, then choose Forgot password.");
    try { await sendPasswordResetEmail(getFirebaseAuth(), email); setMessage("Password reset email sent."); }
    catch (error) { setMessage(authError(error)); }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={() => dispatch(closeAuth())}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close authentication" onClick={() => dispatch(closeAuth())}><IoClose /></button>
        <h2 id="auth-title">{authMode === "login" ? "Log in to Summarist" : "Create your account"}</h2>
        <p>Save books, track your progress, and learn in less time.</p>
        <button className="auth-social" type="button" disabled={busy} onClick={googleLogin}><FaGoogle /> Continue with Google</button>
        <div className="auth-divider"><span>or</span></div>
        <form onSubmit={submit}>
          <label>Email<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={6} placeholder="At least 6 characters" required /></label>
          {message?<p className="form-message" role="alert">{message}</p>:null}<button className="button button-primary" disabled={busy} type="submit">{busy ? "Please wait…" : authMode === "login" ? "Log in" : "Create account"}</button>
        </form>
        {authMode === "login" ? <button className="forgot-password" type="button" onClick={resetPassword}>Forgot your password?</button> : null}
        <button className="guest-button" type="button" onClick={() => { dispatch(loginGuest()); dispatch(closeAuth()); router.push("/for-you"); }}>Continue as a guest</button>
        <p className="auth-switch">
          {authMode === "login" ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => dispatch(setAuthMode(authMode === "login" ? "register" : "login"))}>{authMode === "login" ? "Register" : "Log in"}</button>
        </p>
      </section>
    </div>
  );
}
