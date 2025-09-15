'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Building2,
  FileText,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Bell,
  Award,
  Calendar,
  Download
} from 'lucide-react'

// Mock data - would come from database
const mockData = {
  supplierProfile: {
    completionPercentage: 75,
    verificationStatus: 'PENDING',
    kycStatus: 'VERIFIED',
    blacklistStatus: false
  },
  stats: {
    activeBids: 3,
    wonContracts: 12,
    totalValue: 'K 2.4M',
    successRate: 68
  },
  recentTenders: [
    {
      id: 'TND-2025-001',
      title: 'Medical Equipment Supply for National Hospital',
      agency: 'Department of Health',
      category: 'GOODS',
      value: 'K 2.5M',
      deadline: '2025-01-25T23:59:59',
      status: 'PUBLISHED'
    },
    {
      id: 'TND-2025-004',
      title: 'Office Supplies for Provincial Administration',
      agency: 'Provincial Government',
      category: 'GOODS',
      value: 'K 450K',
      deadline: '2025-01-22T23:59:59',
      status: 'PUBLISHED'
    },
    {
      id: 'TND-2025-005',
      title: 'Vehicle Maintenance Services',
      agency: 'Department of Transport',
      category: 'SERVICES',
      value: 'K 800K',
      deadline: '2025-01-28T23:59:59',
      status: 'PUBLISHED'
    }
  ],
  myBids: [
    {
      id: 'BID-001',
      tenderTitle: 'IT Infrastructure Consulting Services',
      submittedAt: '2025-01-15',
      status: 'UNDER_EVALUATION',
      bidAmount: 'K 750K'
    },
    {
      id: 'BID-002',
      tenderTitle: 'Construction Materials Supply',
      submittedAt: '2025-01-10',
      status: 'AWARDED',
      bidAmount: 'K 1.2M'
    }
  ],
  notifications: [
    {
      id: 1,
      type: 'tender',
      title: 'New tender matches your categories',
      message: 'Medical Equipment Supply for National Hospital',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'bid',
      title: 'Bid evaluation completed',
      message: 'Your bid for IT Infrastructure project has been evaluated',
      time: '1 day ago',
      unread: true
    }
  ]
}

export default function SupplierDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'SUPPLIER_USER') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading' || !session) {
    return <div>Loading...</div>
  }

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffInHours = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h remaining`
    } else {
      const days = Math.ceil(diffInHours / 24)
      return `${days} days remaining`
    }
  }

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'AWARDED':
        return 'bg-green-100 text-green-800'
      case 'UNDER_EVALUATION':
        return 'bg-blue-100 text-blue-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {mockData.notifications.filter(n => n.unread).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mockData.notifications.filter(n => n.unread).length}
              </Badge>
            )}
          </Button>
          <Link href="/supplier/profile">
            <Button size="sm">
              <Building2 className="h-4 w-4 mr-2" />
              Complete Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {mockData.supplierProfile.completionPercentage < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900">Complete Your Profile</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Your profile is {mockData.supplierProfile.completionPercentage}% complete.
                  Complete it to unlock all features and increase your chances of winning contracts.
                </p>
                <Link href="/supplier/profile">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.activeBids}</div>
            <p className="text-xs text-muted-foreground">Under evaluation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Contracts</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.wonContracts}</div>
            <p className="text-xs text-muted-foreground">Total awards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalValue}</div>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">Win rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenders */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Relevant Tenders</CardTitle>
              <Link href="/supplier/tenders">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.recentTenders.map((tender) => (
              <div key={tender.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{tender.title}</h4>
                  <Badge variant="secondary">{tender.category}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{tender.agency}</span>
                    <span>•</span>
                    <span className="font-medium text-green-600">{tender.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {getTimeUntilDeadline(tender.deadline)}
                    </div>
                    <Link href={`/supplier/tenders/${tender.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Bids */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Bids</CardTitle>
              <Link href="/supplier/bids">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.myBids.map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{bid.tenderTitle}</h4>
                  <Badge className={getBidStatusColor(bid.status)}>
                    {bid.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Submitted: {bid.submittedAt}</span>
                    <span>•</span>
                    <span className="font-medium">{bid.bidAmount}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/supplier/tenders">
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Browse Tenders
              </Button>
            </Link>
            <Link href="/supplier/profile">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </Link>
            <Link href="/supplier/bids">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Manage Bids
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
