import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "../components/Provider/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Artify",
  description: "Discover and Share Art",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
