import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NexusEdit AI | Professional Photoshoot Studio",
  description: "Unlimited AI Image Generation, Background Removal, and Multilingual AI Editing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
