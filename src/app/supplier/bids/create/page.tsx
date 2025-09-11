'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Lock,
  Send,
  Save,
  Download,
  X
} from 'lucide-react'

// Mock tender data - would come from API
const mockTender = {
  id: 'TND-2025-001',
  title: 'Medical Equipment Supply for National Hospital',
  agency: 'Department of Health',
  estimatedValue: 2500000,
  currency: 'PGK',
  bidSubmissionDeadline: '2025-01-25T23:59:59',
  category: 'GOODS'
}

type BidDocument = {
  id: string
  name: string
  description: string
  required: boolean
  file?: File
  uploaded: boolean
}

type BidData = {
  bidAmount: string
  currency: 'PGK' | 'USD' | 'AUD'
  bidBondValue: string
  deliveryPeriod: string
  validityPeriod: string
  technicalProposal: string
  financialNotes: string

  documents: BidDocument[]
}

export default function CreateBidPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const tenderId = searchParams.get('tenderId')

  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [bidData, setBidData] = useState<BidData>({
    bidAmount: '',
    currency: 'PGK',
    bidBondValue: '',
    deliveryPeriod: '',
    validityPeriod: '90',
    technicalProposal: '',
    financialNotes: '',

    documents: [
      {
        id: 'tech-proposal',
        name: 'Technical Proposal',
        description: 'Detailed technical proposal addressing all requirements',
        required: true,
        uploaded: false
      },
      {
        id: 'financial-proposal',
        name: 'Financial Proposal',
        description: 'Detailed breakdown of costs and pricing',
        required: true,
        uploaded: false
      },
      {
        id: 'company-profile',
        name: 'Company Profile',
        description: 'Company registration and experience documents',
        required: true,
        uploaded: false
      },
      {
        id: 'bid-bond',
        name: 'Bid Bond/Bank Guarantee',
        description: 'Bid security as per tender requirements',
        required: true,
        uploaded: false
      },
      {
        id: 'tax-clearance',
        name: 'Tax Clearance Certificate',
        description: 'Current tax clearance from IRC',
        required: true,
        uploaded: false
      },
      {
        id: 'certificates',
        name: 'Certifications & Licenses',
        description: 'Relevant professional certifications and licenses',
        required: false,
        uploaded: false
      }
    ]
  })

  useEffect(() => {
    if (!session || session.user.role !== 'SUPPLIER_USER') {
      router.push('/auth/signin')
      return
    }

    if (!tenderId) {
      router.push('/tenders')
      return
    }
  }, [session, tenderId, router])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!bidData.bidAmount) newErrors.bidAmount = 'Bid amount is required'
        if (parseFloat(bidData.bidAmount) <= 0) newErrors.bidAmount = 'Bid amount must be greater than 0'
        if (!bidData.deliveryPeriod) newErrors.deliveryPeriod = 'Delivery period is required'
        if (!bidData.validityPeriod) newErrors.validityPeriod = 'Validity period is required'
        break

      case 2:
        if (!bidData.technicalProposal) newErrors.technicalProposal = 'Technical proposal is required'
        break

      case 3:
        const requiredDocs = bidData.documents.filter(doc => doc.required)
        const uploadedRequiredDocs = requiredDocs.filter(doc => doc.uploaded)
        if (uploadedRequiredDocs.length < requiredDocs.length) {
          newErrors.documents = 'All required documents must be uploaded'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleFileUpload = (documentId: string, file: File) => {
    setBidData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId
          ? { ...doc, file, uploaded: true }
          : doc
      )
    }))
  }

  const handleRemoveFile = (documentId: string) => {
    setBidData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId
          ? { ...doc, file: undefined, uploaded: false }
          : doc
      )
    }))
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      // Save draft - would call API
      console.log('Saving bid draft:', bidData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Failed to save draft:', error)
      alert('Failed to save draft')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitBid = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    try {
      // Submit bid - would call API
      console.log('Submitting bid:', bidData)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Show success and redirect
      alert('Bid submitted successfully!')
      router.push('/supplier/bids')
    } catch (error) {
      console.error('Failed to submit bid:', error)
      alert('Failed to submit bid')
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeUntilDeadline = () => {
    const now = new Date()
    const deadline = new Date(mockTender.bidSubmissionDeadline)
    const diffInHours = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 0) {
      return { text: 'Closed', color: 'text-red-600' }
    } else if (diffInHours < 24) {
      return { text: `${diffInHours}h remaining`, color: 'text-red-600' }
    } else {
      const days = Math.ceil(diffInHours / 24)
      return { text: `${days} days remaining`, color: 'text-green-600' }
    }
  }

  const deadline = getTimeUntilDeadline()

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bidAmount">Bid Amount *</Label>
                  <div className="flex gap-2">
                    <select
                      value={bidData.currency}
                      onChange={(e) => setBidData(prev => ({ ...prev, currency: e.target.value as any }))}
                      className="w-20 p-2 border border-input rounded-md"
                    >
                      <option value="PGK">PGK</option>
                      <option value="USD">USD</option>
                      <option value="AUD">AUD</option>
                    </select>
                    <Input
                      id="bidAmount"
                      type="number"
                      value={bidData.bidAmount}
                      onChange={(e) => setBidData(prev => ({ ...prev, bidAmount: e.target.value }))}
                      placeholder="Enter your bid amount"
                      className={`flex-1 ${errors.bidAmount ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.bidAmount && <p className="text-sm text-red-500">{errors.bidAmount}</p>}
                  <p className="text-xs text-muted-foreground">
                    Estimated value: {mockTender.currency} {mockTender.estimatedValue.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bidBondValue">Bid Bond Value</Label>
                  <Input
                    id="bidBondValue"
                    type="number"
                    value={bidData.bidBondValue}
                    onChange={(e) => setBidData(prev => ({ ...prev, bidBondValue: e.target.value }))}
                    placeholder="Enter bid bond amount"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usually 2-5% of bid amount as per tender requirements
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryPeriod">Delivery/Completion Period *</Label>
                  <Input
                    id="deliveryPeriod"
                    value={bidData.deliveryPeriod}
                    onChange={(e) => setBidData(prev => ({ ...prev, deliveryPeriod: e.target.value }))}
                    placeholder="e.g., 90 days from contract signing"
                    className={errors.deliveryPeriod ? 'border-red-500' : ''}
                  />
                  {errors.deliveryPeriod && <p className="text-sm text-red-500">{errors.deliveryPeriod}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validityPeriod">Bid Validity Period (days) *</Label>
                  <Input
                    id="validityPeriod"
                    type="number"
                    value={bidData.validityPeriod}
                    onChange={(e) => setBidData(prev => ({ ...prev, validityPeriod: e.target.value }))}
                    placeholder="90"
                    className={errors.validityPeriod ? 'border-red-500' : ''}
                  />
                  {errors.validityPeriod && <p className="text-sm text-red-500">{errors.validityPeriod}</p>}
                  <p className="text-xs text-muted-foreground">
                    Period for which your bid remains valid
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialNotes">Financial Notes (Optional)</Label>
              <textarea
                id="financialNotes"
                value={bidData.financialNotes}
                onChange={(e) => setBidData(prev => ({ ...prev, financialNotes: e.target.value }))}
                placeholder="Any additional notes regarding your financial proposal"
                className="w-full min-h-24 p-3 border border-input rounded-md"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="technicalProposal">Technical Proposal *</Label>
              <textarea
                id="technicalProposal"
                value={bidData.technicalProposal}
                onChange={(e) => setBidData(prev => ({ ...prev, technicalProposal: e.target.value }))}
                placeholder="Describe how you will meet the technical requirements, your approach, methodology, and key features of your proposal"
                className={`w-full min-h-48 p-3 border rounded-md ${errors.technicalProposal ? 'border-red-500' : 'border-input'}`}
              />
              {errors.technicalProposal && <p className="text-sm text-red-500">{errors.technicalProposal}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Technical Proposal Guidelines</p>
                  <ul className="space-y-1">
                    <li>• Address all technical requirements mentioned in the tender</li>
                    <li>• Describe your methodology and approach</li>
                    <li>• Highlight key features and benefits</li>
                    <li>• Include relevant experience and expertise</li>
                    <li>• Mention compliance with standards and certifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {bidData.documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{document.name}</h4>
                        {document.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {document.uploaded && (
                          <Badge variant="default" className="text-xs bg-green-600">Uploaded</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {document.description}
                      </p>

                      {document.uploaded && document.file ? (
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{document.file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(document.file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(document.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            PDF, DOC, DOCX up to 50MB
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(document.id, file)
                              }
                            }}
                            className="hidden"
                            id={`file-${document.id}`}
                          />
                          <label
                            htmlFor={`file-${document.id}`}
                            className="cursor-pointer inline-block mt-2"
                          >
                            <Button variant="outline" size="sm" asChild>
                              <span>Choose File</span>
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.documents && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">{errors.documents}</span>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Document Requirements</p>
                  <ul className="space-y-1">
                    <li>• All documents must be in PDF, DOC, or DOCX format</li>
                    <li>• Maximum file size: 50MB per document</li>
                    <li>• Documents should be clearly labeled and organized</li>
                    <li>• Ensure all required documents are uploaded before submission</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Final Review</p>
                  <p>Please review all information carefully. Once submitted, your bid cannot be modified before the deadline.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bid Amount:</span>
                    <span className="font-medium">{bidData.currency} {parseFloat(bidData.bidAmount).toLocaleString()}</span>
                  </div>
                  {bidData.bidBondValue && (
                    <div className="flex justify-between">
                      <span>Bid Bond:</span>
                      <span className="font-medium">{bidData.currency} {parseFloat(bidData.bidBondValue).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Period:</span>
                    <span className="font-medium">{bidData.deliveryPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validity Period:</span>
                    <span className="font-medium">{bidData.validityPeriod} days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bidData.documents.map((doc) => (
                      <div key={doc.id} className="flex justify-between items-center">
                        <span className="text-sm">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          {doc.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                          <Badge variant={doc.uploaded ? "default" : "secondary"} className="text-xs">
                            {doc.uploaded ? "Uploaded" : "Not uploaded"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {!showConfirmation ? (
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <input
                    type="checkbox"
                    id="confirmation"
                    checked={showConfirmation}
                    onChange={(e) => setShowConfirmation(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="confirmation" className="text-sm">
                    I confirm that all information provided is accurate and complete.
                    I understand that this bid will be binding upon acceptance.
                  </Label>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Ready to submit bid</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (deadline.text === 'Closed') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tender Closed</h2>
            <p className="text-muted-foreground mb-4">
              The submission deadline for this tender has passed.
            </p>
            <Button onClick={() => router.push('/tenders')}>
              Back to Tenders
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(`/tenders/${tenderId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tender
          </Button>
          <div className="h-6 border-l border-gray-300" />
          <div>
            <h1 className="text-2xl font-bold">Submit Bid</h1>
            <p className="text-muted-foreground">{mockTender.title}</p>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-lg font-semibold ${deadline.color}`}>
            {deadline.text}
          </div>
          <div className="text-sm text-muted-foreground">
            Deadline: {new Date(mockTender.bidSubmissionDeadline).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === currentStep ? 'bg-red-600 text-white' :
                step < currentStep ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={`text-sm font-medium ${
                step === currentStep ? 'text-red-600' :
                step < currentStep ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step === 1 ? 'Financial' :
                 step === 2 ? 'Technical' :
                 step === 3 ? 'Documents' : 'Review'}
              </p>
            </div>
            {step < 4 && (
              <div className={`w-12 h-0.5 mx-4 ${
                step < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {
              currentStep === 1 ? 'Financial Proposal' :
              currentStep === 2 ? 'Technical Proposal' :
              currentStep === 3 ? 'Upload Documents' :
              'Review & Submit'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>

        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}

          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitBid}
              disabled={!showConfirmation || isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Submit Bid
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
