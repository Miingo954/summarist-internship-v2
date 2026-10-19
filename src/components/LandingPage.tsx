"use client";

import Image from "next/image";
import { AiFillAudio, AiFillBulb, AiFillFileText } from "react-icons/ai";
import { BiCrown } from "react-icons/bi";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { RiLeafLine } from "react-icons/ri";
import { openAuth } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";

const reviews = [
  ["Hanna M.", "This app has been a game-changer for me! It saves time while making the core ideas easy to understand."],
  ["David B.", "The summaries are concise, accurate, and presented through an interface that feels intuitive."],
  ["Nathan S.", "A great way to get the main takeaways from a book without reading the entire thing."],
  ["Ryan R.", "Perfect for busy people who love learning but do not have time to finish every book."],
];

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const login = () => dispatch(openAuth("login"));

  return (
    <>
      <header className="site-header">
        <a href="#home" aria-label="Summarist home"><Image src="/assets/logo.png" alt="Summarist" width={200} height={48} priority /></a>
        <nav aria-label="Main navigation"><button onClick={login}>Login</button><a href="#features">About</a><a href="#footer">Contact</a><a href="#footer">Help</a></nav>
      </header>
      <main>
        <section className="hero section-shell" id="home">
          <div><p className="eyebrow">Learn smarter, every day</p><h1>Gain more knowledge<br />in less time</h1><p>Great summaries for busy people, individuals who barely have time to read, and even people who don’t like to read.</p><button className="button button-primary" onClick={login}>Start learning</button></div>
          <Image src="/assets/landing.png" alt="Reader exploring a digital book summary" width={440} height={390} priority />
        </section>
        <section className="section-shell section" id="features">
          <h2>Understand books in a few minutes</h2>
          <div className="feature-grid">
            <article><AiFillFileText /><h3>Read or listen</h3><p>Save time by getting the core ideas from the best books.</p></article>
            <article><AiFillBulb /><h3>Find your next read</h3><p>Explore book lists and personalized recommendations.</p></article>
            <article><AiFillAudio /><h3>Briefcasts</h3><p>Gain valuable insights wherever your day takes you.</p></article>
          </div>
          <div className="benefit-panel"><div><span>Enhance your knowledge</span><span>Achieve greater success</span><span>Improve your health</span><span>Develop better parenting skills</span><span>Increase happiness</span><span>Be the best version of yourself!</span></div><div className="stats"><p><b>93%</b> of members significantly increase reading frequency.</p><p><b>96%</b> establish better habits.</p><p><b>90%</b> make a positive change in their lives.</p><p><b>91%</b> of members report feeling more productive after incorporating Summarist into their daily routine.</p></div></div>
        </section>
        <section className="reviews section"><div className="section-shell"><h2>What our members say</h2><div className="review-list">{reviews.map(([name, body]) => <article key={name}><div><strong>{name}</strong><span aria-label="5 out of 5 stars">★★★★★</span></div><p>{body}</p></article>)}</div><button className="button button-primary centered" onClick={login}>Join Summarist</button></div></section>
        <section className="section-shell section"><h2>Start growing with Summarist now</h2><div className="number-grid"><article><BiCrown /><strong>3 Million</strong><p>Downloads on all platforms</p></article><article><div><BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill /><BsStarHalf /></div><strong>4.5 Stars</strong><p>Average app-store rating</p></article><article><RiLeafLine /><strong>97%</strong><p>Create a better reading habit</p></article></div></section>
      </main>
      <footer id="footer"><div className="section-shell footer-grid"><div><h3>Actions</h3><a href="#home">Summarist Magazine</a><a href="#home">Cancel Subscription</a><a href="#home">Help</a></div><div><h3>Useful Links</h3><a href="#home">Pricing</a><a href="#home">Gift Cards</a><a href="#home">Authors & Publishers</a></div><div><h3>Company</h3><a href="#home">About</a><a href="#home">Careers</a><a href="#home">Partners</a></div><div><h3>Other</h3><a href="#home">Terms of Service</a><a href="#home">Privacy Policy</a></div></div><p className="copyright">Copyright © 2026 Summarist.</p></footer>
    </>
  );
}
