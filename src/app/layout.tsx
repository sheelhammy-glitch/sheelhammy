import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css"; 
import Providers from "./providers";
import { Toaster } from "sonner"; 
import { FloatingWhatsApp } from "@/components/common/floating-whatsapp";
import { BackToTop } from "@/components/common/back-to-top";
import { ConditionalLayout } from "@/components/Layout/conditional-layout";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { getSettings } from "@/lib/settings";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  return {
    title: settings.siteTitle || settings.platformName || "شيل همي",
    description: settings.siteDescription || settings.siteDescription || "",
    keywords: settings.siteKeywords?.split(",").map(k => k.trim()) || [],
  };
}

 

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;  
}>) {
   
  return (
    
      <html
        lang={"ar"}
        dir="rtl"
        className={tajawal.variable}
        suppressHydrationWarning
      >
        <body className={`${tajawal.className} antialiased`}>
          <Providers>
            <SettingsProvider>
              <Toaster richColors position="top-right" />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <FloatingWhatsApp />
              <BackToTop />
            </SettingsProvider>
          </Providers>
        </body>
      </html> 
  );
}
