import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Paper Boat — build something in 24 hours",
    template: "%s · Paper Boat",
  },
  description: "A tiny 24-hour AI build party. Make something fun, ship it, demo it, go home happy.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
