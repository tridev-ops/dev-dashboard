import './globals.css'
import Sidebar from '@/app/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex bg-zinc-900 min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-zinc-900 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}