'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Eye
} from 'lucide-react'

// Mock data - would come from database
const mockData = {
  agency: {
    name: 'Department of Health',
    code: 'DOH',
    activeContracts: 15,
    pendingApprovals: 3
  },
  stats: {
    activeTenders: 8,
    totalBids: 45,
    avgBidsPerTender: 5.6,
    totalBudget: 'K 25.4M'
  },
  recentTenders: [
    {
      id: 'TND-2025-001',
      title: 'Medical Equipment Supply for National Hospital',
      category: 'GOODS',
      value: 'K 2.5M',
      status: 'PUBLISHED',
      deadline: '2025-01-25T23:59:59',
      bidsReceived: 12
    },
    {
      id: 'TND-2025-007',
      title: 'Hospital Cleaning Services Contract',
      category: 'SERVICES',
      value: 'K 1.8M',
      status: 'UNDER_EVALUATION',
      deadline: '2025-01-20T23:59:59',
      bidsReceived: 8
    },
    {
      id: 'TND-2025-008',
      title: 'Pharmaceutical Supplies Q1 2025',
      category: 'GOODS',
      value: 'K 3.2M',
      status: 'DRAFT',
      deadline: null,
      bidsReceived: 0
    }
  ],
  upcomingDeadlines: [
    {
      id: 'TND-2025-001',
      title: 'Medical Equipment Supply',
      deadline: '2025-01-25T23:59:59',
      type: 'BID_SUBMISSION'
    },
    {
      id: 'TND-2025-006',
      title: 'IT Infrastructure Project',
      deadline: '2025-01-22T14:00:00',
      type: 'BID_OPENING'
    },
    {
      id: 'TND-2025-007',
      title: 'Hospital Cleaning Services',
      deadline: '2025-01-24T17:00:00',
      type: 'EVALUATION_DUE'
    }
  ],
  pendingActions: [
    {
      id: 1,
      type: 'APPROVAL_REQUIRED',
      title: 'Tender TND-2025-008 needs NPC approval',
      priority: 'HIGH',
      dueDate: '2025-01-21'
    },
    {
      id: 2,
      type: 'EVALUATION_OVERDUE',
      title: 'Bid evaluation for TND-2025-007 is overdue',
      priority: 'URGENT',
      dueDate: '2025-01-20'
    },
    {
      id: 3,
      type: 'CONTRACT_SIGNING',
      title: 'Contract for TND-2025-005 ready for signing',
      priority: 'MEDIUM',
      dueDate: '2025-01-23'
    }
  ]
}

export default function AgencyDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'AGENCY_BUYER') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading' || !session) {
    return <div>Loading...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'UNDER_EVALUATION':
        return 'bg-blue-100 text-blue-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'AWARDED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffInHours = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h remaining`
    } else {
      const days = Math.ceil(diffInHours / 24)
      return `${days} days`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Agency Dashboard</h1>
          <p className="text-muted-foreground">
            {mockData.agency.name} ({mockData.agency.code})
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/agency/tenders/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tender
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Actions Alert */}
      {mockData.pendingActions.some(action => action.priority === 'URGENT') && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900">Urgent Actions Required</h4>
                <p className="text-sm text-red-700 mb-3">
                  You have {mockData.pendingActions.filter(a => a.priority === 'URGENT').length} urgent
                  items requiring immediate attention.
                </p>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  View All Actions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.activeTenders}</div>
            <p className="text-xs text-muted-foreground">Currently published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">Across all tenders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Competition</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.avgBidsPerTender}</div>
            <p className="text-xs text-muted-foreground">Bids per tender</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalBudget}</div>
            <p className="text-xs text-muted-foreground">Current fiscal year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenders */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Tenders</CardTitle>
              <Link href="/agency/tenders">
                <Button variant="outline" size="sm">
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
                  <Badge className={getStatusColor(tender.status)}>
                    {tender.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{tender.category}</span>
                    <span>•</span>
                    <span className="font-medium text-green-600">{tender.value}</span>
                    <span>•</span>
                    <span>{tender.bidsReceived} bids</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {tender.deadline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {getTimeUntilDeadline(tender.deadline)}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/agency/tenders/${tender.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.upcomingDeadlines.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {getTimeUntilDeadline(item.deadline)}
                  <span>•</span>
                  <span>{new Date(item.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockData.pendingActions.map((action) => (
            <div key={action.id} className={`border rounded-lg p-4 ${getPriorityColor(action.priority)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Due: {new Date(action.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={action.priority === 'URGENT' ? 'border-red-300' : ''}>
                    {action.priority}
                  </Badge>
                  <Button size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/agency/tenders/create">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Tender
              </Button>
            </Link>
            <Link href="/agency/plans">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Procurement Plans
              </Button>
            </Link>
            <Link href="/agency/contracts">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Manage Contracts
              </Button>
            </Link>
            <Link href="/agency/reports">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
