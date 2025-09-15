'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Search,
  Filter,
  Calendar,
  Building2,
  DollarSign,
  MapPin,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc
} from 'lucide-react'

// Mock data - would come from API
const mockTenders = [
  {
    id: 'TND-2025-001',
    title: 'Medical Equipment Supply for National Hospital',
    description: 'Supply of essential medical equipment including patient monitors, ventilators, and diagnostic equipment for the National Hospital.',
    agency: 'Department of Health',
    category: 'GOODS',
    estimatedValue: 2500000,
    currency: 'PGK',
    publicationDate: '2025-01-15',
    bidSubmissionDeadline: '2025-01-25T23:59:59',
    bidOpeningDatetime: '2025-01-26T10:00:00',
    status: 'PUBLISHED',
    location: 'Port Moresby',
    bidsReceived: 12,
    procurementMethod: 'OPEN',
    siteVisitRequired: true,
    prebidMeetingDate: '2025-01-18T14:00:00'
  },
  {
    id: 'TND-2025-002',
    title: 'Road Rehabilitation Project - Highlands Highway',
    description: 'Rehabilitation and maintenance of 50km section of Highlands Highway including drainage improvements and bridge repairs.',
    agency: 'Department of Works',
    category: 'WORKS',
    estimatedValue: 15200000,
    currency: 'PGK',
    publicationDate: '2025-01-14',
    bidSubmissionDeadline: '2025-01-30T17:00:00',
    bidOpeningDatetime: '2025-01-31T10:00:00',
    status: 'PUBLISHED',
    location: 'Mount Hagen',
    bidsReceived: 8,
    procurementMethod: 'OPEN',
    siteVisitRequired: true,
    prebidMeetingDate: '2025-01-20T10:00:00'
  },
  {
    id: 'TND-2025-003',
    title: 'IT Infrastructure Consulting Services',
    description: 'Consulting services for IT infrastructure upgrade and cybersecurity implementation across government departments.',
    agency: 'Department of Finance',
    category: 'CONSULTING',
    estimatedValue: 800000,
    currency: 'PGK',
    publicationDate: '2025-01-16',
    bidSubmissionDeadline: '2025-01-28T15:00:00',
    bidOpeningDatetime: '2025-01-29T09:00:00',
    status: 'PUBLISHED',
    location: 'Port Moresby',
    bidsReceived: 5,
    procurementMethod: 'RESTRICTED',
    siteVisitRequired: false
  },
  {
    id: 'TND-2025-004',
    title: 'Office Supplies for Provincial Administration',
    description: 'Supply of office supplies and stationery for provincial government offices including paper, computers, and furniture.',
    agency: 'Provincial Government - Western',
    category: 'GOODS',
    estimatedValue: 450000,
    currency: 'PGK',
    publicationDate: '2025-01-17',
    bidSubmissionDeadline: '2025-01-22T16:00:00',
    bidOpeningDatetime: '2025-01-23T11:00:00',
    status: 'PUBLISHED',
    location: 'Daru',
    bidsReceived: 15,
    procurementMethod: 'REQUEST_FOR_QUOTATIONS',
    siteVisitRequired: false
  },
  {
    id: 'TND-2025-005',
    title: 'Vehicle Maintenance Services',
    description: 'Comprehensive vehicle maintenance and repair services for government fleet including routine servicing and emergency repairs.',
    agency: 'Department of Transport',
    category: 'SERVICES',
    estimatedValue: 800000,
    currency: 'PGK',
    publicationDate: '2025-01-18',
    bidSubmissionDeadline: '2025-01-28T17:00:00',
    bidOpeningDatetime: '2025-01-29T14:00:00',
    status: 'PUBLISHED',
    location: 'Port Moresby',
    bidsReceived: 9,
    procurementMethod: 'OPEN',
    siteVisitRequired: true
  }
]

type SortOption = 'deadline' | 'value' | 'publication' | 'agency'
type SortDirection = 'asc' | 'desc'

export default function TendersPage() {
  const searchParams = useSearchParams()
  const [filteredTenders, setFilteredTenders] = useState(mockTenders)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('deadline')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    agency: searchParams.get('agency') || '',
    location: searchParams.get('location') || '',
    valueMin: searchParams.get('valueMin') || '',
    valueMax: searchParams.get('valueMax') || '',
    procurementMethod: searchParams.get('method') || '',
    siteVisitRequired: searchParams.get('siteVisit') === 'true',
    status: 'PUBLISHED'
  })

  // Get unique values for filter dropdowns
  const agencies = [...new Set(mockTenders.map(t => t.agency))].sort()
  const locations = [...new Set(mockTenders.map(t => t.location))].sort()
  const categories = ['GOODS', 'WORKS', 'SERVICES', 'CONSULTING']
  const methods = ['OPEN', 'RESTRICTED', 'REQUEST_FOR_QUOTATIONS', 'SINGLE_SOURCE', 'FRAMEWORK']

  useEffect(() => {
    applyFilters()
  }, [filters, sortBy, sortDirection])

  const applyFilters = () => {
    let filtered = mockTenders.filter(tender => {
      const matchesSearch = !filters.search ||
        tender.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        tender.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        tender.agency.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory = !filters.category || tender.category === filters.category
      const matchesAgency = !filters.agency || tender.agency === filters.agency
      const matchesLocation = !filters.location || tender.location === filters.location
      const matchesMethod = !filters.procurementMethod || tender.procurementMethod === filters.procurementMethod
      const matchesSiteVisit = !filters.siteVisitRequired || tender.siteVisitRequired
      const matchesStatus = tender.status === filters.status

      const valueMin = filters.valueMin ? parseFloat(filters.valueMin) : 0
      const valueMax = filters.valueMax ? parseFloat(filters.valueMax) : Infinity
      const matchesValue = tender.estimatedValue >= valueMin && tender.estimatedValue <= valueMax

      return matchesSearch && matchesCategory && matchesAgency && matchesLocation &&
             matchesMethod && matchesSiteVisit && matchesStatus && matchesValue
    })

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'deadline':
          aValue = new Date(a.bidSubmissionDeadline)
          bValue = new Date(b.bidSubmissionDeadline)
          break
        case 'value':
          aValue = a.estimatedValue
          bValue = b.estimatedValue
          break
        case 'publication':
          aValue = new Date(a.publicationDate)
          bValue = new Date(b.publicationDate)
          break
        case 'agency':
          aValue = a.agency
          bValue = b.agency
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTenders(filtered)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      agency: '',
      location: '',
      valueMin: '',
      valueMax: '',
      procurementMethod: '',
      siteVisitRequired: false,
      status: 'PUBLISHED'
    })
  }

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffInHours = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 0) {
      return 'Closed'
    } else if (diffInHours < 24) {
      return `${diffInHours}h remaining`
    } else {
      const days = Math.ceil(diffInHours / 24)
      return `${days} days remaining`
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    return `${currency} ${(value / 1000000).toFixed(1)}M`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GOODS': return 'bg-blue-100 text-blue-800'
      case 'WORKS': return 'bg-green-100 text-green-800'
      case 'SERVICES': return 'bg-purple-100 text-purple-800'
      case 'CONSULTING': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'RESTRICTED': return 'bg-yellow-100 text-yellow-800'
      case 'REQUEST_FOR_QUOTATIONS': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Government Tenders</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse current government procurement opportunities from Papua New Guinea's public sector
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredTenders.length}</div>
            <div className="text-sm text-muted-foreground">Open Tenders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredTenders.reduce((sum, t) => sum + t.bidsReceived, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Bids</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(filteredTenders.reduce((sum, t) => sum + t.estimatedValue, 0), 'PGK')}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{agencies.length}</div>
            <div className="text-sm text-muted-foreground">Agencies</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders by title, description, or agency..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Sort by:</Label>
                <select
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-')
                    setSortBy(field as SortOption)
                    setSortDirection(direction as SortDirection)
                  }}
                  className="text-sm border border-input rounded px-2 py-1"
                >
                  <option value="deadline-asc">Deadline (Early First)</option>
                  <option value="deadline-desc">Deadline (Late First)</option>
                  <option value="value-desc">Value (High to Low)</option>
                  <option value="value-asc">Value (Low to High)</option>
                  <option value="publication-desc">Publication (Latest First)</option>
                  <option value="agency-asc">Agency (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-input rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Agency</Label>
                <select
                  value={filters.agency}
                  onChange={(e) => setFilters(prev => ({ ...prev, agency: e.target.value }))}
                  className="w-full p-2 border border-input rounded"
                >
                  <option value="">All Agencies</option>
                  {agencies.map(agency => (
                    <option key={agency} value={agency}>{agency}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 border border-input rounded"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Procurement Method</Label>
                <select
                  value={filters.procurementMethod}
                  onChange={(e) => setFilters(prev => ({ ...prev, procurementMethod: e.target.value }))}
                  className="w-full p-2 border border-input rounded"
                >
                  <option value="">All Methods</option>
                  {methods.map(method => (
                    <option key={method} value={method}>{method.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Value (PGK)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.valueMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, valueMin: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Value (PGK)</Label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.valueMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, valueMax: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="siteVisitRequired"
                  checked={filters.siteVisitRequired}
                  onChange={(e) => setFilters(prev => ({ ...prev, siteVisitRequired: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="siteVisitRequired">Site visit required</Label>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredTenders.length} tender{filteredTenders.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {filteredTenders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tenders found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more tenders.
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredTenders.map((tender) => (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{tender.title}</h3>
                          <p className="text-sm text-muted-foreground">Tender No: {tender.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(tender.estimatedValue, tender.currency)}
                          </div>
                          <div className="text-sm text-muted-foreground">Estimated Value</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(tender.category)}>
                          {tender.category}
                        </Badge>
                        <Badge className={getMethodColor(tender.procurementMethod)}>
                          {tender.procurementMethod.replace(/_/g, ' ')}
                        </Badge>
                        {tender.siteVisitRequired && (
                          <Badge variant="outline">Site Visit Required</Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground line-clamp-2">
                        {tender.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{tender.agency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{tender.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{tender.bidsReceived} bids received</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Published: {new Date(tender.publicationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={getTimeUntilDeadline(tender.bidSubmissionDeadline).includes('Closed') ? 'text-red-600' : 'text-green-600'}>
                            {getTimeUntilDeadline(tender.bidSubmissionDeadline)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm space-y-1">
                        <div><strong>Submission Deadline:</strong> {new Date(tender.bidSubmissionDeadline).toLocaleString()}</div>
                        <div><strong>Bid Opening:</strong> {new Date(tender.bidOpeningDatetime).toLocaleString()}</div>
                        {tender.prebidMeetingDate && (
                          <div><strong>Pre-bid Meeting:</strong> {new Date(tender.prebidMeetingDate).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date(tender.publicationDate).toLocaleDateString()}
                    </div>
                    <Link href={`/tenders/${tender.id}`}>
                      <Button>
                        View Details
                        <FileText className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
