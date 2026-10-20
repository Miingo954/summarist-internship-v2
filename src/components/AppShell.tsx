"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBookOpen, FiHelpCircle, FiHome, FiLogIn, FiLogOut, FiMenu, FiSearch, FiSettings, FiX, FiZap } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { logout, openAuth } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Book } from "@/types/book";
import BookCover from "@/components/BookCover";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = window.setTimeout(() => {
      fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then(setResults)
        .finally(() => setSearching(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setResults([]);
    setSearching(value.trim().length >= 2);
  };

  const handleAuth = async () => {
    setMenuOpen(false);
    if (!email) return dispatch(openAuth("login"));
    await signOut(getFirebaseAuth()).catch(() => undefined);
    dispatch(logout());
  };

  return (
    <div className="app-shell">
      <button className={`sidebar-backdrop ${menuOpen ? "is-visible" : ""}`} type="button" aria-label="Close navigation menu" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} />
      <aside id="app-navigation" className={`sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {menuOpen ? <button className="mobile-sidebar-close" type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)}><FiX /></button> : null}
        <Image src="/assets/logo.png" alt="Summarist" width={180} height={44} />
        <nav>
          <Link className={path === "/for-you" ? "active" : ""} href="/for-you"><FiHome />For you</Link>
          <Link className={path === "/library" ? "active" : ""} href="/library"><FiBookOpen />My Library</Link>
          <span className="disabled-nav" title="Coming soon"><FiZap />Highlights</span>
          <span className="disabled-nav" title="Use the search bar"><FiSearch />Search</span>
          <Link className={path === "/settings" ? "active" : ""} href="/settings"><FiSettings />Settings</Link>
        </nav>
        <div>
          <span className="disabled-nav" title="Coming soon"><FiHelpCircle />Help &amp; Support</span>
          <button type="button" onClick={handleAuth}>{email ? <FiLogOut /> : <FiLogIn />}{email ? "Logout" : "Login"}</button>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div className="mobile-nav-brand">
            <button className="mobile-menu-toggle" type="button" aria-label="Open navigation menu" aria-controls="app-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><FiMenu /></button>
            <Image src="/assets/logo.png" alt="Summarist" width={142} height={35} />
          </div>
          <div className="search-box">
            <label><FiSearch /><input aria-label="Search books" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search by title or author" /></label>
            {query ? <div className="search-results">{searching ? <p>Searching…</p> : results.length ? results.slice(0, 6).map((book) => <Link href={`/book/${book.id}`} key={book.id} onClick={() => updateQuery("")}><BookCover src={book.imageLink} title={book.title} width={36} height={50} /><span><b>{book.title}</b><small>{book.author}</small></span></Link>) : <p>No books found.</p>}</div> : null}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
