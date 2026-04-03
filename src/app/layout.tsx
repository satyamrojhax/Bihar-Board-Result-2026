import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import DocsButton from "@/components/DocsButton";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BSEB Result Portal - Bihar Board Class 10th Result 2026",
  description:
    "Check your Bihar School Examination Board (BSEB) Class 10th Annual Secondary Examination Result 2026 instantly. Enter your Roll Code and Roll Number to get your result.",
  keywords: [
    "BSEB Result",
    "Bihar Board Result",
    "Class 10th Result",
    "Matric Result",
    "Bihar Board 2026",
    "Secondary Examination Result",
  ],
  authors: [{ name: "Satyam Rojha" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "BSEB Result Portal - Bihar Board Class 10th Result 2026",
    description:
      "Check your Bihar Board Class 10th Result 2026 instantly online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
      >
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <DocsButton />
        <Toaster />
      </body>
    </html>
  );
}
