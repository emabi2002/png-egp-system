'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Send,
  Eye,
  Share2
} from 'lucide-react'

// Mock tender data - would come from API
const mockTender = {
  id: 'TND-2025-001',
  refNo: 'TND-2025-001',
  title: 'Medical Equipment Supply for National Hospital',
  description: `The Department of Health invites sealed bids from qualified suppliers for the supply of essential medical equipment for the National Hospital. The equipment includes patient monitors, ventilators, diagnostic equipment, and related accessories.

This procurement is critical for improving healthcare delivery at the National Hospital and must meet international standards for medical equipment. All equipment must come with comprehensive warranties, installation support, and training for medical staff.

The successful supplier will be required to provide ongoing maintenance and support services for a period of 3 years from installation.`,

  agency: {
    name: 'Department of Health',
    code: 'DOH',
    contactEmail: 'procurement@health.gov.pg',
    contactPhone: '+675 123 4567'
  },

  category: 'GOODS',
  estimatedValue: 2500000,
  currency: 'PGK',
  procurementMethod: 'OPEN',

  publicationDate: '2025-01-15T00:00:00',
  bidSubmissionDeadline: '2025-01-25T23:59:59',
  bidOpeningDatetime: '2025-01-26T10:00:00',
  questionsDeadline: '2025-01-20T17:00:00',

  status: 'PUBLISHED',
  location: 'Port Moresby',
  siteVisitRequired: true,
  siteVisitDatetime: '2025-01-18T14:00:00',
  prebidMeetingDatetime: '2025-01-18T10:00:00',

  eligibilityCriteria: `Suppliers must meet the following eligibility criteria:

• Valid business registration in Papua New Guinea
• Minimum 5 years experience in medical equipment supply
• ISO 13485 certification for medical devices
• Financial capacity to handle contracts of this magnitude
• Technical capability to provide installation and training
• Authorized dealer status for proposed equipment brands`,

  evaluationCriteria: [
    {
      criterion: 'Technical Compliance',
      weight: 40,
      description: 'Compliance with technical specifications and quality standards'
    },
    {
      criterion: 'Experience and Capability',
      weight: 25,
      description: 'Supplier experience and technical capability assessment'
    },
    {
      criterion: 'Financial Proposal',
      weight: 30,
      description: 'Cost competitiveness and value for money'
    },
    {
      criterion: 'After-sales Support',
      weight: 5,
      description: 'Warranty, maintenance, and support services offered'
    }
  ],

  documents: [
    {
      id: 'doc-1',
      name: 'Tender Document',
      description: 'Complete tender specifications and requirements',
      required: true,
      size: '2.4 MB',
      type: 'PDF'
    },
    {
      id: 'doc-2',
      name: 'Technical Specifications',
      description: 'Detailed technical requirements for all equipment',
      required: true,
      size: '1.8 MB',
      type: 'PDF'
    },
    {
      id: 'doc-3',
      name: 'Bill of Quantities',
      description: 'Detailed breakdown of quantities and specifications',
      required: true,
      size: '956 KB',
      type: 'Excel'
    },
    {
      id: 'doc-4',
      name: 'Site Layout Plan',
      description: 'Hospital layout and installation requirements',
      required: false,
      size: '3.2 MB',
      type: 'PDF'
    }
  ],

  clarifications: [
    {
      id: 1,
      question: 'Are refurbished equipment acceptable for this tender?',
      answer: 'No, only brand new equipment will be accepted. All equipment must come with full manufacturer warranties.',
      askedBy: 'Supplier Inquiry',
      answeredDate: '2025-01-17T14:30:00'
    },
    {
      id: 2,
      question: 'Can the delivery be done in phases?',
      answer: 'Yes, phased delivery is acceptable provided the complete delivery is within 90 days of contract signing.',
      askedBy: 'Supplier Inquiry',
      answeredDate: '2025-01-17T16:15:00'
    }
  ],

  bidsReceived: 12,
  viewCount: 248
}

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)

  const tenderId = params.id as string

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffInMs = deadlineDate.getTime() - now.getTime()

    if (diffInMs < 0) {
      return { text: 'Closed', color: 'text-red-600', urgent: false }
    }

    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return {
        text: `${diffInHours}h remaining`,
        color: 'text-red-600',
        urgent: true
      }
    } else if (diffInHours < 72) {
      const days = Math.ceil(diffInHours / 24)
      return {
        text: `${days} days remaining`,
        color: 'text-orange-600',
        urgent: true
      }
    } else {
      const days = Math.ceil(diffInHours / 24)
      return {
        text: `${days} days remaining`,
        color: 'text-green-600',
        urgent: false
      }
    }
  }

  const deadline = getTimeUntilDeadline(mockTender.bidSubmissionDeadline)
  const questionsOpen = new Date() < new Date(mockTender.questionsDeadline)

  const handleDownloadDocument = (docId: string) => {
    console.log('Downloading document:', docId)
    // Would trigger actual download
  }

  const handleSubmitBid = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'SUPPLIER_USER') {
      alert('Only registered suppliers can submit bids')
      return
    }

    router.push(`/supplier/bids/create?tenderId=${tenderId}`)
  }

  const formatCurrency = (value: number, currency: string) => {
    return `${currency} ${value.toLocaleString()}`
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'clarifications', label: 'Clarifications', icon: CheckCircle },
    { id: 'timeline', label: 'Timeline', icon: Calendar }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenders
        </Button>
        <div className="h-6 border-l border-gray-300" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          {mockTender.agency.name}
        </div>
      </div>

      {/* Title and Status */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{mockTender.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Tender No: {mockTender.refNo}</span>
              <span>•</span>
              <span>{mockTender.viewCount} views</span>
              <span>•</span>
              <span>Published: {new Date(mockTender.publicationDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {session?.user.role === 'SUPPLIER_USER' && deadline.text !== 'Closed' && (
              <Button onClick={handleSubmitBid} className="bg-red-600 hover:bg-red-700">
                <Send className="h-4 w-4 mr-2" />
                Submit Bid
              </Button>
            )}
          </div>
        </div>

        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockTender.estimatedValue, mockTender.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">Estimated Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <div className={`text-lg font-bold ${deadline.color}`}>
                    {deadline.text}
                  </div>
                  <div className="text-xs text-muted-foreground">To Submit Bids</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {mockTender.bidsReceived}
                  </div>
                  <div className="text-xs text-muted-foreground">Bids Received</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {mockTender.location}
                  </div>
                  <div className="text-xs text-muted-foreground">Location</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status and Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getCategoryColor(mockTender.category)}>
            {mockTender.category}
          </Badge>
          <Badge variant="outline">
            {mockTender.procurementMethod.replace(/_/g, ' ')}
          </Badge>
          {mockTender.siteVisitRequired && (
            <Badge variant="secondary">Site Visit Required</Badge>
          )}
          {deadline.urgent && (
            <Badge variant="destructive">Urgent - {deadline.text}</Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{mockTender.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{mockTender.eligibilityCriteria}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTender.evaluationCriteria.map((criterion, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{criterion.criterion}</h4>
                          <Badge variant="outline">{criterion.weight}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {criterion.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium">{mockTender.agency.name}</div>
                    <div className="text-sm text-muted-foreground">Agency Code: {mockTender.agency.code}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{mockTender.agency.contactEmail}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{mockTender.agency.contactPhone}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Important Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Questions Deadline:</span>
                    <span className={`text-sm font-medium ${questionsOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {new Date(mockTender.questionsDeadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Submission Deadline:</span>
                    <span className={`text-sm font-medium ${deadline.color}`}>
                      {new Date(mockTender.bidSubmissionDeadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bid Opening:</span>
                    <span className="text-sm font-medium">
                      {new Date(mockTender.bidOpeningDatetime).toLocaleDateString()}
                    </span>
                  </div>
                  {mockTender.siteVisitDatetime && (
                    <div className="flex justify-between">
                      <span className="text-sm">Site Visit:</span>
                      <span className="text-sm font-medium">
                        {new Date(mockTender.siteVisitDatetime).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {mockTender.prebidMeetingDatetime && (
                    <div className="flex justify-between">
                      <span className="text-sm">Pre-bid Meeting:</span>
                      <span className="text-sm font-medium">
                        {new Date(mockTender.prebidMeetingDatetime).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {deadline.text !== 'Closed' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Take Action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!session ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Sign in to submit a bid or ask questions
                        </p>
                        <Link href="/auth/signin">
                          <Button className="w-full">Sign In</Button>
                        </Link>
                      </div>
                    ) : session.user.role === 'SUPPLIER_USER' ? (
                      <div className="space-y-3">
                        <Button onClick={handleSubmitBid} className="w-full bg-red-600 hover:bg-red-700">
                          Submit Bid
                        </Button>
                        {questionsOpen && (
                          <Button variant="outline" className="w-full">
                            Ask Question
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Only registered suppliers can submit bids
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Tender Documents</CardTitle>
              <p className="text-sm text-muted-foreground">
                Download the following documents to understand the full requirements
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTender.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">{document.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{document.type}</span>
                          <span>•</span>
                          <span>{document.size}</span>
                          {document.required && (
                            <>
                              <span>•</span>
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'clarifications' && (
          <div className="space-y-6">
            {questionsOpen && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">Questions Period Open</p>
                      <p className="text-sm text-green-700">
                        You can submit questions until {new Date(mockTender.questionsDeadline).toLocaleString()}
                      </p>
                      {session?.user.role === 'SUPPLIER_USER' && (
                        <Button size="sm" className="mt-2">Ask a Question</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Questions & Answers</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Public clarifications and responses from the procuring entity
                </p>
              </CardHeader>
              <CardContent>
                {mockTender.clarifications.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No clarifications yet</h3>
                    <p className="text-muted-foreground">
                      Questions and answers will appear here as they are submitted and responded to.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockTender.clarifications.map((clarification) => (
                      <div key={clarification.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium">Q: {clarification.question}</h4>
                            <p className="text-sm text-muted-foreground">
                              Asked by {clarification.askedBy} • {new Date(clarification.answeredDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm"><strong>A:</strong> {clarification.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <Card>
            <CardHeader>
              <CardTitle>Procurement Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Key dates and milestones for this tender
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Tender Published</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(mockTender.publicationDate).toLocaleDateString()} at {new Date(mockTender.publicationDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {mockTender.prebidMeetingDatetime && (
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      new Date() > new Date(mockTender.prebidMeetingDatetime) ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pre-bid Meeting</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mockTender.prebidMeetingDatetime).toLocaleDateString()} at {new Date(mockTender.prebidMeetingDatetime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {mockTender.siteVisitDatetime && (
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      new Date() > new Date(mockTender.siteVisitDatetime) ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Site Visit</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mockTender.siteVisitDatetime).toLocaleDateString()} at {new Date(mockTender.siteVisitDatetime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    new Date() > new Date(mockTender.questionsDeadline) ? 'bg-green-500' : questionsOpen ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}>
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Questions Deadline</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(mockTender.questionsDeadline).toLocaleDateString()} at {new Date(mockTender.questionsDeadline).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    deadline.text === 'Closed' ? 'bg-green-500' : deadline.urgent ? 'bg-red-500' : 'bg-gray-400'
                  }`}>
                    <Send className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bid Submission Deadline</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(mockTender.bidSubmissionDeadline).toLocaleDateString()} at {new Date(mockTender.bidSubmissionDeadline).toLocaleTimeString()}
                    </p>
                    <p className={`text-sm font-medium ${deadline.color}`}>
                      {deadline.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bid Opening</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(mockTender.bidOpeningDatetime).toLocaleDateString()} at {new Date(mockTender.bidOpeningDatetime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
