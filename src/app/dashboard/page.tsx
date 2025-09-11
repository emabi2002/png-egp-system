'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Redirect based on user role
    switch (session.user.role) {
      case 'NPC_ADMIN':
        router.push('/admin/dashboard')
        break
      case 'AGENCY_BUYER':
        router.push('/agency/dashboard')
        break
      case 'SUPPLIER_USER':
        router.push('/supplier/dashboard')
        break
      case 'AUDITOR':
        router.push('/audit/dashboard')
        break
      default:
        // Stay on this page if role is unknown
        break
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to PNG e-GP</h1>
        <p className="text-muted-foreground">
          Hello {session.user.name}, welcome to your dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your account setup is in progress. You'll be redirected to your role-specific dashboard shortly.</p>
        </CardContent>
      </Card>
    </div>
  )
}
