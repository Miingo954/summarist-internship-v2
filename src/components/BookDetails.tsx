"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiBookOpen, FiCheck, FiHeadphones, FiStar } from "react-icons/fi";
import AppShell from "./AppShell";
import BookCover from "./BookCover";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToLibrary, removeFromLibrary } from "@/store/store";
import type { Book } from "@/types/book";
export default function BookDetails(){const{id}=useParams<{id:string}>();const router=useRouter();const dispatch=useAppDispatch();const[book,setBook]=useState<Book|null>(null);const saved=useAppSelector(state=>state.library.books.some(item=>item.id===id));useEffect(()=>{fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`).then(response=>response.json()).then(setBook)},[id]);if(!book)return <AppShell><main className="dashboard"><div className="book-skeleton"/></main></AppShell>;const toggle=()=>saved?dispatch(removeFromLibrary(book.id)):dispatch(addToLibrary(book));return <AppShell><main className="dashboard book-detail"><div><p className="eyebrow">Book summary</p><h1>{book.title}</h1><h2>{book.subTitle}</h2><p>{book.author}</p><div className="book-meta"><span><FiStar/>{book.averageRating} ({book.totalRating} ratings)</span><span><FiBookOpen/>{book.keyIdeas} key ideas</span><span><FiHeadphones/>{book.type}</span></div><div className="book-actions"><button className="button button-primary" onClick={()=>router.push(`/player/${book.id}`)}>Read or listen</button><button className={`button button-outline${saved?" saved":""}`} onClick={toggle}>{saved?<><FiCheck/> In library</>:"Add to library"}</button></div><h3>What’s it about?</h3>{book.tags?.length?<div className="book-tags">{book.tags.map(tag=><span key={tag}>{tag}</span>)}</div>:null}<p>{book.bookDescription}</p><h3>About the author</h3><p>{book.authorDescription}</p></div><BookCover src={book.imageLink} title={book.title} width={280} height={400}/></main></AppShell>}
