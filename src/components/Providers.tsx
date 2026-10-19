"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import { hydrateAuth, hydrateLibrary, store } from "@/store/store";
import AuthModal from "@/components/AuthModal";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const subscribeToClient = () => () => undefined;

function LibraryPersistence() {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("summarist-library");
      if (saved) store.dispatch(hydrateLibrary(JSON.parse(saved)));
      const auth = window.localStorage.getItem("summarist-auth");
      if (auth) store.dispatch(hydrateAuth(JSON.parse(auth)));
    } catch { window.localStorage.removeItem("summarist-library"); }
    const unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (user?.email) store.dispatch(hydrateAuth({ email: user.email, subscription: store.getState().auth.subscription }));
    });
    const unsubscribeStore = store.subscribe(() => {
      window.localStorage.setItem("summarist-library", JSON.stringify(store.getState().library.books));
      window.localStorage.setItem("summarist-auth", JSON.stringify(store.getState().auth));
    });
    return () => { unsubscribeAuth(); unsubscribeStore(); };
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const clientReady = useSyncExternalStore(subscribeToClient, () => true, () => false);
  return <Provider store={store}>{clientReady ? <><LibraryPersistence/><AuthModal />{children}</> : null}</Provider>;
}
