import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppShell from '@/components/AppShell'
import TransactionProvider from '@/components/TransactionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SecureBank - Online Banking',
  description: 'Secure and easy online banking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TransactionProvider>
          <AppShell>
            {children}
          </AppShell>
        </TransactionProvider>
      </body>
    </html>
  )
}
