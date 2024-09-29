import type { Metadata } from "next";
import localFont from "next/font/local";
import { Raleway } from "next/font/google"; // Import Raleway from Google Fonts
import "./globals.css";

// Local Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Google Font Raleway
const raleway = Raleway({
  weight: ["100", "400", "700"], // Specify the weights you need
  subsets: ["latin"],
  variable: "--font-raleway", // Custom CSS variable for Raleway
});

export const metadata: Metadata = {
  title: "SIH Project",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
