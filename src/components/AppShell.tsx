"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBookOpen, FiHelpCircle, FiHome, FiLogIn, FiLogOut, FiSearch, FiSettings, FiZap } from "react-icons/fi";
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

  const handleAuth = async () => { if (!email) return dispatch(openAuth("login")); await signOut(getFirebaseAuth()).catch(() => undefined); dispatch(logout()); };
  return <div className="app-shell"><aside className="sidebar"><Image src="/assets/logo.png" alt="Summarist" width={180} height={44}/><nav><Link className={path === "/for-you" ? "active" : ""} href="/for-you"><FiHome/>For you</Link><Link className={path === "/library" ? "active" : ""} href="/library"><FiBookOpen/>My Library</Link><span className="disabled-nav" title="Coming soon"><FiZap/>Highlights</span><span className="disabled-nav" title="Use the search bar"><FiSearch/>Search</span><Link className={path === "/settings" ? "active" : ""} href="/settings"><FiSettings/>Settings</Link></nav><div><span className="disabled-nav" title="Coming soon"><FiHelpCircle/>Help & Support</span><button onClick={handleAuth}>{email?<FiLogOut/>:<FiLogIn/>}{email ? "Logout" : "Login"}</button></div></aside><div className="app-main"><header className="app-topbar"><div className="search-box"><label><FiSearch/><input aria-label="Search books" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search by title or author"/></label>{query ? <div className="search-results">{searching ? <p>Searching…</p> : results.length ? results.slice(0, 6).map((book) => <Link href={`/book/${book.id}`} key={book.id} onClick={() => updateQuery("")}><BookCover src={book.imageLink} title={book.title} width={36} height={50}/><span><b>{book.title}</b><small>{book.author}</small></span></Link>) : <p>No books found.</p>}</div> : null}</div></header>{children}</div></div>;
}
