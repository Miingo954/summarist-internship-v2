"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { hydrateLibrary, store } from "@/store/store";
import AuthModal from "@/components/AuthModal";

function LibraryPersistence() {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("summarist-library");
      if (saved) store.dispatch(hydrateLibrary(JSON.parse(saved)));
    } catch { window.localStorage.removeItem("summarist-library"); }
    return store.subscribe(() => window.localStorage.setItem("summarist-library", JSON.stringify(store.getState().library.books)));
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><LibraryPersistence/><AuthModal />{children}</Provider>;
}
