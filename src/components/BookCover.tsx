"use client";

import Image from "next/image";

export default function BookCover({ src, title, width, height }: { src?: string; title: string; width: number; height: number }) {
  if (!src?.trim()) {
    return <div className="book-cover-fallback" style={{ width, aspectRatio: `${width} / ${height}` }} aria-label={`No cover available for ${title}`}><span>SUMMARIST</span><strong>{title}</strong></div>;
  }
  return <Image src={src} alt={`Cover of ${title}`} width={width} height={height} />;
}
