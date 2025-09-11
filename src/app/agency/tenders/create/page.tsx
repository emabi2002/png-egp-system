'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Upload,
  CheckCircle,
  AlertCircle,
  Save,
  Send
} from 'lucide-react'

type TenderStep = 'basic' | 'details' | 'criteria' | 'documents' | 'timeline' | 'review'

type TenderData = {
  // Basic Information
  title: string
  description: string
  category: 'GOODS' | 'WORKS' | 'SERVICES' | 'CONSULTING'
  procurementMethod: 'OPEN' | 'RESTRICTED' | 'REQUEST_FOR_QUOTATIONS' | 'SINGLE_SOURCE' | 'FRAMEWORK'
  estimatedValue: string
  currency: 'PGK' | 'USD' | 'AUD' | 'OTHER'

  // Details
  eligibilityCriteria: string
  siteVisitRequired: boolean
  prebidMeetingRequired: boolean

  // Evaluation Criteria
  evaluationMethod: 'LOWEST_EVALUATED' | 'QUALITY_COST_BASED' | 'QUALITY_BASED' | 'FIXED_BUDGET' | 'LEAST_COST'
  technicalWeight: number
  financialWeight: number
  evaluationCriteria: Array<{
    criterion: string
    weight: number
    description: string
  }>

  // Timeline
  bidSubmissionDeadline: string
  bidOpeningDatetime: string
  siteVisitDatetime?: string
  prebidMeetingDatetime?: string
  questionsDeadline: string

  // Documents
  documents: Array<{
    name: string
    description: string
    required: boolean
    file?: File
  }>
}

export default function CreateTenderPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState<TenderStep>('basic')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [tenderData, setTenderData] = useState<TenderData>({
    title: '',
    description: '',
    category: 'GOODS',
    procurementMethod: 'OPEN',
    estimatedValue: '',
    currency: 'PGK',
    eligibilityCriteria: '',
    siteVisitRequired: false,
    prebidMeetingRequired: false,
    evaluationMethod: 'LOWEST_EVALUATED',
    technicalWeight: 30,
    financialWeight: 70,
    evaluationCriteria: [
      { criterion: 'Technical Capability', weight: 30, description: 'Evaluation of technical expertise and capability' },
      { criterion: 'Financial Proposal', weight: 70, description: 'Cost effectiveness and value for money' }
    ],
    bidSubmissionDeadline: '',
    bidOpeningDatetime: '',
    questionsDeadline: '',
    documents: [
      { name: 'Tender Document', description: 'Main tender specifications and requirements', required: true },
      { name: 'Bill of Quantities', description: 'Detailed breakdown of quantities and specifications', required: false },
      { name: 'Technical Specifications', description: 'Detailed technical requirements', required: true }
    ]
  })

  const steps: Array<{
    id: TenderStep
    title: string
    description: string
    icon: any
  }> = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Tender title, category, and estimated value',
      icon: FileText
    },
    {
      id: 'details',
      title: 'Requirements',
      description: 'Eligibility criteria and special requirements',
      icon: Users
    },
    {
      id: 'criteria',
      title: 'Evaluation',
      description: 'Evaluation method and scoring criteria',
      icon: CheckCircle
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Tender documents and attachments',
      icon: Upload
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Important dates and deadlines',
      icon: Calendar
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Final review before submission',
      icon: Send
    }
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const validateStep = (step: TenderStep): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 'basic':
        if (!tenderData.title) newErrors.title = 'Title is required'
        if (!tenderData.description) newErrors.description = 'Description is required'
        if (!tenderData.estimatedValue) newErrors.estimatedValue = 'Estimated value is required'
        break

      case 'details':
        if (!tenderData.eligibilityCriteria) newErrors.eligibilityCriteria = 'Eligibility criteria is required'
        break

      case 'criteria':
        if (tenderData.technicalWeight + tenderData.financialWeight !== 100) {
          newErrors.weights = 'Technical and financial weights must total 100%'
        }
        break

      case 'timeline':
        if (!tenderData.bidSubmissionDeadline) newErrors.bidSubmissionDeadline = 'Bid submission deadline is required'
        if (!tenderData.bidOpeningDatetime) newErrors.bidOpeningDatetime = 'Bid opening date/time is required'
        if (!tenderData.questionsDeadline) newErrors.questionsDeadline = 'Questions deadline is required'

        // Validate date logic
        const submissionDate = new Date(tenderData.bidSubmissionDeadline)
        const openingDate = new Date(tenderData.bidOpeningDatetime)
        const questionsDate = new Date(tenderData.questionsDeadline)

        if (submissionDate <= new Date()) {
          newErrors.bidSubmissionDeadline = 'Submission deadline must be in the future'
        }
        if (openingDate <= submissionDate) {
          newErrors.bidOpeningDatetime = 'Opening date must be after submission deadline'
        }
        if (questionsDate >= submissionDate) {
          newErrors.questionsDeadline = 'Questions deadline must be before submission deadline'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const currentIndex = getCurrentStepIndex()
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id)
      }
    }
  }

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      // Save as draft - would call API
      console.log('Saving draft:', tenderData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Failed to save draft:', error)
      alert('Failed to save draft')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep('review')) return

    setIsLoading(true)
    try {
      // Submit for NPC approval - would call API
      console.log('Submitting tender:', tenderData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Tender submitted for NPC approval!')
      router.push('/agency/tenders')
    } catch (error) {
      console.error('Failed to submit tender:', error)
      alert('Failed to submit tender')
    } finally {
      setIsLoading(false)
    }
  }

  const addEvaluationCriterion = () => {
    setTenderData(prev => ({
      ...prev,
      evaluationCriteria: [
        ...prev.evaluationCriteria,
        { criterion: '', weight: 0, description: '' }
      ]
    }))
  }

  const removeEvaluationCriterion = (index: number) => {
    setTenderData(prev => ({
      ...prev,
      evaluationCriteria: prev.evaluationCriteria.filter((_, i) => i !== index)
    }))
  }

  const addDocument = () => {
    setTenderData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        { name: '', description: '', required: false }
      ]
    }))
  }

  const removeDocument = (index: number) => {
    setTenderData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title *</Label>
                <Input
                  id="title"
                  value={tenderData.title}
                  onChange={(e) => setTenderData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a clear, descriptive title for the tender"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={tenderData.description}
                  onChange={(e) => setTenderData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a detailed description of what you are procuring"
                  className={`w-full min-h-32 p-3 border rounded-md ${errors.description ? 'border-red-500' : 'border-input'}`}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={tenderData.category}
                    onChange={(e) => setTenderData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="GOODS">Goods</option>
                    <option value="WORKS">Works</option>
                    <option value="SERVICES">Services</option>
                    <option value="CONSULTING">Consulting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procurementMethod">Procurement Method *</Label>
                  <select
                    id="procurementMethod"
                    value={tenderData.procurementMethod}
                    onChange={(e) => setTenderData(prev => ({ ...prev, procurementMethod: e.target.value as any }))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="OPEN">Open Tender</option>
                    <option value="RESTRICTED">Restricted Tender</option>
                    <option value="REQUEST_FOR_QUOTATIONS">Request for Quotations</option>
                    <option value="SINGLE_SOURCE">Single Source</option>
                    <option value="FRAMEWORK">Framework Agreement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Estimated Value *</Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    value={tenderData.estimatedValue}
                    onChange={(e) => setTenderData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                    placeholder="Enter estimated value"
                    className={errors.estimatedValue ? 'border-red-500' : ''}
                  />
                  {errors.estimatedValue && <p className="text-sm text-red-500">{errors.estimatedValue}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <select
                    id="currency"
                    value={tenderData.currency}
                    onChange={(e) => setTenderData(prev => ({ ...prev, currency: e.target.value as any }))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="PGK">Kina (PGK)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eligibilityCriteria">Eligibility Criteria *</Label>
                <textarea
                  id="eligibilityCriteria"
                  value={tenderData.eligibilityCriteria}
                  onChange={(e) => setTenderData(prev => ({ ...prev, eligibilityCriteria: e.target.value }))}
                  placeholder="Specify the eligibility requirements for suppliers (e.g., registration requirements, experience, financial capacity)"
                  className={`w-full min-h-32 p-3 border rounded-md ${errors.eligibilityCriteria ? 'border-red-500' : 'border-input'}`}
                />
                {errors.eligibilityCriteria && <p className="text-sm text-red-500">{errors.eligibilityCriteria}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="siteVisitRequired"
                    checked={tenderData.siteVisitRequired}
                    onChange={(e) => setTenderData(prev => ({ ...prev, siteVisitRequired: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="siteVisitRequired">Site visit required</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="prebidMeetingRequired"
                    checked={tenderData.prebidMeetingRequired}
                    onChange={(e) => setTenderData(prev => ({ ...prev, prebidMeetingRequired: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="prebidMeetingRequired">Pre-bid meeting required</Label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Eligibility Guidelines</p>
                    <ul className="space-y-1">
                      <li>• Specify minimum experience requirements</li>
                      <li>• Include required certifications or licenses</li>
                      <li>• Define financial capacity requirements</li>
                      <li>• Mention any geographic restrictions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'criteria':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evaluationMethod">Evaluation Method *</Label>
                <select
                  id="evaluationMethod"
                  value={tenderData.evaluationMethod}
                  onChange={(e) => setTenderData(prev => ({ ...prev, evaluationMethod: e.target.value as any }))}
                  className="w-full p-2 border border-input rounded-md"
                >
                  <option value="LOWEST_EVALUATED">Lowest Evaluated Responsive Bid</option>
                  <option value="QUALITY_COST_BASED">Quality and Cost Based Selection</option>
                  <option value="QUALITY_BASED">Quality Based Selection</option>
                  <option value="FIXED_BUDGET">Fixed Budget Selection</option>
                  <option value="LEAST_COST">Least Cost Selection</option>
                </select>
              </div>

              {(tenderData.evaluationMethod === 'QUALITY_COST_BASED') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technicalWeight">Technical Weight (%)</Label>
                    <Input
                      id="technicalWeight"
                      type="number"
                      min="0"
                      max="100"
                      value={tenderData.technicalWeight}
                      onChange={(e) => setTenderData(prev => ({
                        ...prev,
                        technicalWeight: parseInt(e.target.value) || 0,
                        financialWeight: 100 - (parseInt(e.target.value) || 0)
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financialWeight">Financial Weight (%)</Label>
                    <Input
                      id="financialWeight"
                      type="number"
                      value={tenderData.financialWeight}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  {errors.weights && <p className="text-sm text-red-500 col-span-2">{errors.weights}</p>}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Evaluation Criteria</Label>
                  <Button type="button" onClick={addEvaluationCriterion} variant="outline" size="sm">
                    Add Criterion
                  </Button>
                </div>

                {tenderData.evaluationCriteria.map((criterion, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <div className="space-y-2">
                          <Label>Criterion Name</Label>
                          <Input
                            value={criterion.criterion}
                            onChange={(e) => {
                              const newCriteria = [...tenderData.evaluationCriteria]
                              newCriteria[index].criterion = e.target.value
                              setTenderData(prev => ({ ...prev, evaluationCriteria: newCriteria }))
                            }}
                            placeholder="e.g., Technical Capability"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={criterion.weight}
                            onChange={(e) => {
                              const newCriteria = [...tenderData.evaluationCriteria]
                              newCriteria[index].weight = parseInt(e.target.value) || 0
                              setTenderData(prev => ({ ...prev, evaluationCriteria: newCriteria }))
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={criterion.description}
                            onChange={(e) => {
                              const newCriteria = [...tenderData.evaluationCriteria]
                              newCriteria[index].description = e.target.value
                              setTenderData(prev => ({ ...prev, evaluationCriteria: newCriteria }))
                            }}
                            placeholder="Describe how this will be evaluated"
                          />
                        </div>
                      </div>
                      {tenderData.evaluationCriteria.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeEvaluationCriterion(index)}
                          variant="outline"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Total Weight:</strong> {tenderData.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0)}%
                    {tenderData.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0) !== 100 && (
                      <span className="text-red-600 ml-2">⚠ Should total 100%</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Tender Documents</Label>
                <Button type="button" onClick={addDocument} variant="outline" size="sm">
                  Add Document
                </Button>
              </div>

              {tenderData.documents.map((document, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Document Name</Label>
                      <Input
                        value={document.name}
                        onChange={(e) => {
                          const newDocuments = [...tenderData.documents]
                          newDocuments[index].name = e.target.value
                          setTenderData(prev => ({ ...prev, documents: newDocuments }))
                        }}
                        placeholder="e.g., Tender Document"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={document.description}
                        onChange={(e) => {
                          const newDocuments = [...tenderData.documents]
                          newDocuments[index].description = e.target.value
                          setTenderData(prev => ({ ...prev, documents: newDocuments }))
                        }}
                        placeholder="Describe the document content"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={document.required}
                        onChange={(e) => {
                          const newDocuments = [...tenderData.documents]
                          newDocuments[index].required = e.target.checked
                          setTenderData(prev => ({ ...prev, documents: newDocuments }))
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`required-${index}`}>Required document</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                      {tenderData.documents.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeDocument(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Document Guidelines</p>
                    <ul className="space-y-1">
                      <li>• Upload PDF files only (max 50MB per file)</li>
                      <li>• Ensure all documents are complete and accurate</li>
                      <li>• Mark documents as required if suppliers must provide them</li>
                      <li>• Include technical specifications, drawings, and BOQ as needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'timeline':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionsDeadline">Questions Deadline *</Label>
                  <Input
                    id="questionsDeadline"
                    type="datetime-local"
                    value={tenderData.questionsDeadline}
                    onChange={(e) => setTenderData(prev => ({ ...prev, questionsDeadline: e.target.value }))}
                    className={errors.questionsDeadline ? 'border-red-500' : ''}
                  />
                  {errors.questionsDeadline && <p className="text-sm text-red-500">{errors.questionsDeadline}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bidSubmissionDeadline">Bid Submission Deadline *</Label>
                  <Input
                    id="bidSubmissionDeadline"
                    type="datetime-local"
                    value={tenderData.bidSubmissionDeadline}
                    onChange={(e) => setTenderData(prev => ({ ...prev, bidSubmissionDeadline: e.target.value }))}
                    className={errors.bidSubmissionDeadline ? 'border-red-500' : ''}
                  />
                  {errors.bidSubmissionDeadline && <p className="text-sm text-red-500">{errors.bidSubmissionDeadline}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bidOpeningDatetime">Bid Opening Date & Time *</Label>
                  <Input
                    id="bidOpeningDatetime"
                    type="datetime-local"
                    value={tenderData.bidOpeningDatetime}
                    onChange={(e) => setTenderData(prev => ({ ...prev, bidOpeningDatetime: e.target.value }))}
                    className={errors.bidOpeningDatetime ? 'border-red-500' : ''}
                  />
                  {errors.bidOpeningDatetime && <p className="text-sm text-red-500">{errors.bidOpeningDatetime}</p>}
                </div>

                {tenderData.siteVisitRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="siteVisitDatetime">Site Visit Date & Time</Label>
                    <Input
                      id="siteVisitDatetime"
                      type="datetime-local"
                      value={tenderData.siteVisitDatetime || ''}
                      onChange={(e) => setTenderData(prev => ({ ...prev, siteVisitDatetime: e.target.value }))}
                    />
                  </div>
                )}

                {tenderData.prebidMeetingRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="prebidMeetingDatetime">Pre-bid Meeting Date & Time</Label>
                    <Input
                      id="prebidMeetingDatetime"
                      type="datetime-local"
                      value={tenderData.prebidMeetingDatetime || ''}
                      onChange={(e) => setTenderData(prev => ({ ...prev, prebidMeetingDatetime: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-1">Timeline Guidelines</p>
                    <ul className="space-y-1">
                      <li>• Allow sufficient time for suppliers to prepare bids (minimum 14 days)</li>
                      <li>• Questions deadline should be at least 7 days before submission</li>
                      <li>• Bid opening should be within 24 hours of submission deadline</li>
                      <li>• Site visits and pre-bid meetings should be scheduled early in the process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notice</p>
                  <p>Please review all information carefully. Once submitted, this tender will be sent to NPC for approval and cannot be modified without going through the amendment process.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Title:</strong> {tenderData.title}</div>
                  <div><strong>Category:</strong> {tenderData.category}</div>
                  <div><strong>Method:</strong> {tenderData.procurementMethod.replace(/_/g, ' ')}</div>
                  <div><strong>Estimated Value:</strong> {tenderData.currency} {tenderData.estimatedValue}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Questions Deadline:</strong> {new Date(tenderData.questionsDeadline).toLocaleString()}</div>
                  <div><strong>Submission Deadline:</strong> {new Date(tenderData.bidSubmissionDeadline).toLocaleString()}</div>
                  <div><strong>Bid Opening:</strong> {new Date(tenderData.bidOpeningDatetime).toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents ({tenderData.documents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tenderData.documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{doc.name}</span>
                        <Badge variant={doc.required ? "default" : "secondary"}>
                          {doc.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return <div>Step content for {currentStep}</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Tender</h1>
          <p className="text-muted-foreground">
            Step {getCurrentStepIndex() + 1} of {steps.length}: {steps[getCurrentStepIndex()]?.title}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = getCurrentStepIndex() > index

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-red-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 max-w-24">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[getCurrentStepIndex()]?.icon, { className: "h-5 w-5" })}
              {steps[getCurrentStepIndex()]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={getCurrentStepIndex() === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === 'review' ? (
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? 'Submitting...' : 'Submit for Approval'}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
