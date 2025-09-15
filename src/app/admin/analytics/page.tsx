'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Shield,
  Target
} from 'lucide-react'

// Mock analytics data - would come from API
const mockAnalytics = {
  overview: {
    totalTenders: 245,
    activeTenders: 45,
    completedTenders: 167,
    totalValue: 'K 125.4M',
    avgCycleTime: 28,
    supplierSatisfaction: 78,
    complianceRate: 94
  },
  procurementCycle: [
    { month: 'Jan', avgDays: 32, target: 30 },
    { month: 'Feb', avgDays: 29, target: 30 },
    { month: 'Mar', avgDays: 31, target: 30 },
    { month: 'Apr', avgDays: 27, target: 30 },
    { month: 'May', avgDays: 25, target: 30 },
    { month: 'Jun', avgDays: 28, target: 30 }
  ],
  spendingByAgency: [
    { agency: 'Health', amount: 45.2, percentage: 36 },
    { agency: 'Education', amount: 32.1, percentage: 26 },
    { agency: 'Works', amount: 28.7, percentage: 23 },
    { agency: 'Finance', amount: 12.4, percentage: 10 },
    { agency: 'Other', amount: 7.0, percentage: 5 }
  ],
  complianceMetrics: [
    { category: 'Legal Requirements', score: 98, status: 'excellent' },
    { category: 'Procurement Act 2018', score: 96, status: 'excellent' },
    { category: 'Financial Management', score: 92, status: 'good' },
    { category: 'Electronic Transactions', score: 89, status: 'good' },
    { category: 'Digital Government Plan', score: 85, status: 'satisfactory' }
  ],
  supplierMetrics: {
    total: 1250,
    verified: 1100,
    active: 890,
    blacklisted: 15,
    performance: [
      { range: '90-100%', count: 320, color: '#10B981' },
      { range: '80-89%', count: 450, color: '#F59E0B' },
      { range: '70-79%', count: 280, color: '#EF4444' },
      { range: '60-69%', count: 120, color: '#6B7280' },
      { range: '<60%', count: 80, color: '#374151' }
    ]
  }
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'satisfactory': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Procurement performance metrics and compliance monitoring for PNG NPC
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Period
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Procurement Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockAnalytics.overview.totalValue}</div>
            <p className="text-xs text-muted-foreground">2024 fiscal year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Procurement Cycle</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.avgCycleTime} days</div>
            <p className="text-xs text-green-600">↓ 2 days from target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplier Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.supplierSatisfaction}%</div>
            <p className="text-xs text-blue-600">Target: ≥75%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockAnalytics.overview.complianceRate}%</div>
            <p className="text-xs text-green-600">Exceeds target</p>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Cycle Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Procurement Cycle Performance vs Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalytics.procurementCycle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgDays"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Actual Days"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#EF4444"
                strokeDasharray="5 5"
                name="Target (30 days)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Agency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Spending by Agency (2024)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockAnalytics.spendingByAgency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agency" />
                <YAxis label={{ value: 'Amount (K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`K ${value}M`, 'Amount']} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Supplier Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockAnalytics.supplierMetrics.performance}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.range}: ${entry.count}`}
                >
                  {mockAnalytics.supplierMetrics.performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Legal & Regulatory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Legal & Regulatory Compliance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAnalytics.complianceMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{metric.category}</h4>
                  <Badge className={getComplianceColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.score >= 95 ? 'bg-green-500' :
                        metric.score >= 85 ? 'bg-blue-500' :
                        metric.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{metric.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Indicators (PNG NPC Requirements) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            PNG NPC Success Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm">80% of tenders via e-GP (Target 2026)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '67%'}} />
                  </div>
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm">50% reduction in cycle time (Target 2027)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '43%'}} />
                  </div>
                  <span className="text-sm font-medium">43%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Supplier satisfaction ≥75%</span>
                <Badge className="bg-green-100 text-green-800">
                  ✓ Achieved (78%)
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Positive audit compliance</span>
                <Badge className="bg-green-100 text-green-800">
                  ✓ Achieved (94%)
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail & Transparency Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <p className="text-sm text-muted-foreground">Digital Records</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">2.4s</div>
              <p className="text-sm text-muted-foreground">Avg Audit Query Time</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <p className="text-sm text-muted-foreground">Public Transparency</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <p className="text-sm text-muted-foreground">Compliance Issues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
