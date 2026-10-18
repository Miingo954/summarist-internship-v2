"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { closeAuth, loginGuest, setAuthMode } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authOpen, authMode } = useAppSelector((state) => state.ui);

  useEffect(() => {
    document.body.style.overflow = authOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [authOpen]);

  if (!authOpen) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={() => dispatch(closeAuth())}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close authentication" onClick={() => dispatch(closeAuth())}><IoClose /></button>
        <h2 id="auth-title">{authMode === "login" ? "Log in to Summarist" : "Create your account"}</h2>
        <p>Save books, track your progress, and learn in less time.</p>
        <button className="auth-social" type="button"><FaGoogle /> Continue with Google</button>
        <div className="auth-divider"><span>or</span></div>
        <form onSubmit={submit}>
          <label>Email<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={6} placeholder="At least 6 characters" required /></label>
          <button className="button button-primary" type="submit">{authMode === "login" ? "Log in" : "Create account"}</button>
        </form>
        <button className="guest-button" type="button" onClick={() => { dispatch(loginGuest()); dispatch(closeAuth()); router.push("/for-you"); }}>Continue as a guest</button>
        <p className="auth-switch">
          {authMode === "login" ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => dispatch(setAuthMode(authMode === "login" ? "register" : "login"))}>{authMode === "login" ? "Register" : "Log in"}</button>
        </p>
      </section>
    </div>
  );
}
