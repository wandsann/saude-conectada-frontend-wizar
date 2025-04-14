import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarItem {
  title: string
  path: string
  icon: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: '📊'
  },
  {
    title: 'Pacientes',
    path: '/pacientes',
    icon: '👥'
  },
  {
    title: 'Consultas',
    path: '/consultas',
    icon: '📅'
  },
  {
    title: 'Produtos',
    path: '/produtos',
    icon: '💊'
  },
  {
    title: 'Vendas',
    path: '/vendas',
    icon: '💰'
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: '📈'
  }
]

interface BaseLayoutProps {
  children: React.ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const { user, logout } = useAuth()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-semibold">Saúde Conectada</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              ✕
            </Button>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100",
                  location.pathname === item.path && "bg-gray-100 text-primary"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                ☰
              </Button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Olá, {user?.name || 'Usuário'}
                </span>
                <Button variant="outline" onClick={logout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 