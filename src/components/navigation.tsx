'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
// Temporarily simplified - will add back complex components later
import {
  Building2,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  Shield,
  Home,
  Search,
  Bell,
  Award,
  BarChart3,
  Calculator
} from 'lucide-react'
import { UserRole } from '@prisma/client'
import { PNGLogo } from './png-logo'

export function Navigation() {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getNavigationItems = () => {
    if (!session?.user) {
      return [
        { href: '/', label: 'Home', icon: Home },
        { href: '/tenders', label: 'View Tenders', icon: Search },
        { href: '/awards', label: 'Awards', icon: Award },
        { href: '/suppliers', label: 'Suppliers', icon: Building2 },
      ]
    }

    const role = session.user.role
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
    ]

    switch (role) {
      case UserRole.NPC_ADMIN:
        return [
          ...baseItems,
          { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { href: '/admin/agencies', label: 'Agencies', icon: Building2 },
          { href: '/admin/users', label: 'Users', icon: Users },
          { href: '/admin/tenders', label: 'All Tenders', icon: FileText },
          { href: '/admin/blacklist', label: 'Blacklist', icon: Shield },
          { href: '/admin/audit', label: 'Audit Logs', icon: FileText },
          { href: '/admin/settings', label: 'Settings', icon: Settings },
        ]

      case UserRole.AGENCY_BUYER:
        return [
          ...baseItems,
          { href: '/agency/plans', label: 'Procurement Plans', icon: FileText },
          { href: '/agency/tenders', label: 'My Tenders', icon: FileText },
          { href: '/agency/evaluations', label: 'Evaluations', icon: Calculator },
          { href: '/agency/contracts', label: 'Contracts', icon: FileText },
          { href: '/agency/payments', label: 'Payments', icon: FileText },
        ]

      case UserRole.SUPPLIER_USER:
        return [
          ...baseItems,
          { href: '/supplier/profile', label: 'My Profile', icon: Building2 },
          { href: '/supplier/tenders', label: 'Available Tenders', icon: Search },
          { href: '/supplier/bids', label: 'My Bids', icon: FileText },
          { href: '/supplier/contracts', label: 'My Contracts', icon: FileText },
        ]

      case UserRole.AUDITOR:
        return [
          ...baseItems,
          { href: '/audit/tenders', label: 'All Tenders', icon: FileText },
          { href: '/audit/contracts', label: 'All Contracts', icon: FileText },
          { href: '/audit/reports', label: 'Reports', icon: FileText },
          { href: '/audit/logs', label: 'Audit Logs', icon: Shield },
        ]

      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <PNGLogo size="md" className="shadow-lg" />
                <div className="hidden sm:block">
                  <div className="font-bold text-lg text-foreground">PNG e-GP</div>
                  <div className="text-xs text-muted-foreground">National Procurement Commission</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Menu & Mobile Menu */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Bell className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {session.user.name
                          ?.split(' ')
                          .map((name) => name[0])
                          .join('')
                          .toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
