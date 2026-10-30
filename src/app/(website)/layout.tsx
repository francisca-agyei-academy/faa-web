import { Footer } from "@/components/website/Footer";
import { Navbar } from "@/components/website/Navbar";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
