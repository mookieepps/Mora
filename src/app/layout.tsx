import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mora — Make pregnancy much easier",
  description:
    "One private family page to share pregnancy updates — from pregnancy, to labor, to the moment your baby arrives.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans text-charcoal">
        {children}
      </body>
    </html>
  );
}
