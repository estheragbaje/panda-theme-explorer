import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { modeScript } from "./mode-script";

export const metadata: Metadata = {
  title: "Theme Explorer",
  description: "Six Panda CSS themes on one page built with Ark UI. Preview each in light and dark, then use it in your own project.",
  applicationName: "Theme Explorer",
  openGraph: {
    title: "Theme Explorer",
    description: "Six Panda CSS themes on one page built with Ark UI. Preview each in light and dark, then use it in your own project.",
    type: "website",
  },
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
