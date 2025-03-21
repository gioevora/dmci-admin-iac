import "./globals.css";
import PrelineScript from "./utility/prelinescript";
import { Metadata } from "next";

// Define metadata for the layout
export const metadata: Metadata = {
  title: "DMCI Homes | Admin",
  description: "Lerom Ipsum.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <PrelineScript />
      </body>
    </html>
  );
}
