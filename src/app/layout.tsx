import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";
import "./rubric.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summarist | Learn More in Less Time",
  description: "Read and listen to concise ideas from the world’s best books.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={inter.className}><Providers>{children}</Providers></body></html>;
}
