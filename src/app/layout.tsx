import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { modeScript } from "./mode-script";

export const metadata: Metadata = {
  title: "Panda Themes",
  description: "Six themes built with Panda CSS, one component set.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script may add .dark before React hydrates.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
