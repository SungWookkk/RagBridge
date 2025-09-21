// app/layout.tsx
import "./globals.css"
import Providers from "./providers"

export const metadata = { title: "Doc AI", description: "Kafka + OCR + RAG" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
