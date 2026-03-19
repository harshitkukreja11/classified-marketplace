import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Classified Marketplace",
  description: "Buy and sell items",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <Providers>
          <Navbar />
          
          <main className="p-6">
            {children}
          </main>
        </Providers>

      </body>
    </html>
  );
}