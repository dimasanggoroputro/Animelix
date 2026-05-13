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
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          shimmer: true,
          unsafe_disableDevelopmentModeWarnings: true,
        },

        variables: {
          colorPrimary: "#ef4444",
          colorBackground: "#09090b",
          colorInputBackground: "#18181b",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorDanger: "#ef4444",
          colorSuccess: "#22c55e",

          borderRadius: "1rem",

          fontFamily: "var(--font-geist-sans)",

          spacingUnit: "1rem",
        },

        elements: {
          // =========================
          // CARD
          // =========================
          card: `
            relative
            bg-zinc-950/95
            backdrop-blur-2xl
            border border-white/10
            shadow-[0_0_50px_rgba(239,68,68,0.15)]
            rounded-3xl
            overflow-hidden
          `,

          cardBox: "shadow-none",

          // Glow Effect
          rootBox: "flex items-center justify-center",
          
          // =========================
          // HEADER
          // =========================
          headerTitle: `
            text-white
            font-bold
            text-3xl
            tracking-tight
          `,

          headerSubtitle: `
            text-zinc-400
            text-sm
          `,

          // =========================
          // FORM
          // =========================
          formFieldLabel: `
            text-zinc-300
            text-sm
            font-medium
            mb-2
          `,

          formFieldInput: `
            h-12
            bg-zinc-900/80
            border
            border-white/10
            text-white
            placeholder:text-zinc-500
            rounded-xl
            transition-all
            duration-200

            focus:border-red-500
            focus:ring-4
            focus:ring-red-500/20
            focus:bg-zinc-900

            hover:border-white/20
          `,

          formFieldInputShowPasswordButton:
            "text-zinc-500 hover:text-white transition-colors",

          // =========================
          // BUTTON
          // =========================
          formButtonPrimary: `
            h-12
            bg-red-600
            hover:bg-red-500
            active:scale-[0.98]
            transition-all
            duration-200
            text-white
            font-semibold
            rounded-xl
            shadow-lg
            shadow-red-900/40
          `,

          formButtonReset:
            "text-zinc-400 hover:text-white transition-colors",

          // =========================
          // SOCIAL BUTTON
          // =========================
          socialButtonsBlockButton: `
            h-12
            bg-zinc-900/70
            hover:bg-zinc-800
            border
            border-white/10
            rounded-xl
            transition-all
            duration-200
            text-white

            hover:border-white/20
          `,

          socialButtonsBlockButtonText: `
            text-white
            font-medium
          `,

          socialButtonsProviderIcon: "brightness-110",

          // =========================
          // DIVIDER
          // =========================
          dividerLine: "bg-white/10",

          dividerText: `
            text-zinc-500
            text-xs
            uppercase
            tracking-widest
          `,

          // =========================
          // FOOTER
          // =========================
          footer: "border-t border-white/5 pt-6",

          footerActionText: "text-zinc-500",

          footerActionLink: `
            text-red-500
            hover:text-red-400
            font-semibold
            transition-colors
          `,

          // =========================
          // ALERT
          // =========================
          alert: `
            bg-red-500/10
            border
            border-red-500/20
            text-red-300
            rounded-xl
          `,

          alertText: "text-sm text-red-200",

          // =========================
          // OTP
          // =========================
          otpCodeFieldInput: `
            bg-zinc-900
            border
            border-white/10
            text-white
            rounded-xl

            focus:border-red-500
            focus:ring-red-500/20
          `,

          // =========================
          // USER BUTTON
          // =========================
          userButtonPopoverCard: `
            bg-zinc-950/95
            backdrop-blur-2xl
            border
            border-white/10
            rounded-2xl
            shadow-2xl
            shadow-black/50
          `,

          userButtonPopoverActionButton: `
            hover:bg-zinc-800
            rounded-xl
            transition-colors
          `,

          userButtonPopoverActionButtonText:
            "text-zinc-300 hover:text-white",

          userButtonPopoverActionButtonIcon:
            "text-zinc-500",

          userButtonPopoverFooter:
            "border-t border-white/5",

          userPreviewMainIdentifier:
            "text-white font-semibold",

          userPreviewSecondaryIdentifier:
            "text-zinc-400",

          identityPreviewText: "text-white",

          identityPreviewEditButton:
            "text-red-500 hover:text-red-400",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
        <body className="min-h-screen flex flex-col bg-black text-white">
          {/* Background Glow */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[120px]" />
          </div>

          <NavBar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}