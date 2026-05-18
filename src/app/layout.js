import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Animeku",
  description:
    "Aplikasi streaming anime gratis dengan koleksi lengkap dan pembaruan rutin.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      clerkJSVariant="headless"
      appearance={{
        variables: {
          colorPrimary: "#dc2626",
          colorBackground: "#09090b",
          colorInputBackground: "#18181b",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorDanger: "#ef4444",
          colorSuccess: "#22c55e",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          card: "bg-zinc-950 border border-white/10 shadow-2xl shadow-black/50",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton:
            "bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white transition-colors",
          socialButtonsBlockButtonText: "text-white font-medium",
          dividerLine: "bg-white/10",
          dividerText: "text-gray-500",
          formFieldLabel: "text-gray-300 text-sm",
          formFieldInput:
            "bg-zinc-900 border-white/10 text-white placeholder-gray-600 focus:border-red-500",
          formButtonPrimary:
            "bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors",
          footerActionLink:
            "text-red-500 hover:text-red-400 font-medium transition-colors",
          footerActionText: "text-gray-500",
          footer: "border-t border-white/5",
          userButtonPopoverCard:
            "bg-zinc-950 border border-white/10 shadow-2xl",
          userButtonPopoverActionButton:
            "hover:bg-zinc-800 text-gray-300 hover:text-white transition-colors",
          userButtonPopoverActionButtonText: "text-gray-300",
          userButtonPopoverFooter: "border-t border-white/5",
          userPreviewMainIdentifier: "text-white font-semibold",
          userPreviewSecondaryIdentifier: "text-gray-400",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <NavBar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
