import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import AuthProvider from "../components/AuthProvider/AuthProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient application for managing personal notes. Write, organize and find your notes with ease.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a simple and efficient application for managing personal notes. Write, organize and find your notes with ease.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <div id="modal-root"></div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
