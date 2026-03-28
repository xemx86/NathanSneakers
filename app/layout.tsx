import "./globals.css";
import { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
