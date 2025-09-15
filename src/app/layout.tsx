import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { Toaster } from '@/components/ui/sonner'
import { PNGLogo } from '@/components/png-logo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PNG e-Government Procurement (e-GP)',
  description: 'A secure, transparent, and efficient e-Government Procurement platform for Papua New Guinea National Procurement Commission',
  keywords: ['procurement', 'government', 'PNG', 'tender', 'bidding', 'e-GP'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
            <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <PNGLogo size="sm" />
                    <span className="text-sm text-muted-foreground">
                      A service of the National Procurement Commission (PNG)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    © 2025 National Procurement Commission. All rights reserved.
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
