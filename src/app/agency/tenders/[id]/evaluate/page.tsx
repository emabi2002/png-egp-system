'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FileText,
  Users,
  Calculator,
  Award,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'

// Mock data - would come from API in production
const mockTender = {
  id: 'TND-2025-001',
  title: 'Medical Equipment Supply for National Hospital',
  agency: 'Department of Health',
  category: 'GOODS',
  value: 'K 2.5M',
  status: 'UNDER_EVALUATION',
  evaluationCriteria: [
    { name: 'Technical Compliance', weight: 40, description: 'Meeting all technical specifications' },
    { name: 'Financial Proposal', weight: 30, description: 'Cost effectiveness and value for money' },
    { name: 'Experience & Capacity', weight: 20, description: 'Relevant experience and organizational capacity' },
    { name: 'Local Content', weight: 10, description: 'PNG local content and participation' }
  ]
}

const mockBids = [
  {
    id: 'BID-001',
    supplier: 'MedEquip PNG Ltd',
    amount: 'K 2.2M',
    submittedAt: '2025-01-20',
    status: 'RESPONSIVE',
    documents: ['Technical Proposal.pdf', 'Financial Proposal.pdf', 'Company Profile.pdf']
  },
  {
    id: 'BID-002',
    supplier: 'Pacific Medical Supplies',
    amount: 'K 2.4M',
    submittedAt: '2025-01-22',
    status: 'RESPONSIVE',
    documents: ['Technical Proposal.pdf', 'Financial Proposal.pdf', 'References.pdf']
  },
  {
    id: 'BID-003',
    supplier: 'Global Healthcare Solutions',
    amount: 'K 1.9M',
    submittedAt: '2025-01-24',
    status: 'RESPONSIVE',
    documents: ['Technical Proposal.pdf', 'Financial Proposal.pdf', 'Certifications.pdf']
  }
]

export default function TenderEvaluationPage() {
  const params = useParams()
  const [currentPhase, setCurrentPhase] = useState('technical')
  const [evaluationScores, setEvaluationScores] = useState<Record<string, Record<string, number>>>({})
  const [selectedBid, setSelectedBid] = useState<string | null>(null)

  const phases = [
    { id: 'preliminary', name: 'Preliminary Review', icon: FileText },
    { id: 'technical', name: 'Technical Evaluation', icon: Calculator },
    { id: 'financial', name: 'Financial Evaluation', icon: Calculator },
    { id: 'recommendation', name: 'Final Recommendation', icon: Award }
  ]

  const handleScoreChange = (bidId: string, criteria: string, score: number) => {
    setEvaluationScores(prev => ({
      ...prev,
      [bidId]: {
        ...prev[bidId],
        [criteria]: score
      }
    }))
  }

  const calculateWeightedScore = (bidId: string) => {
    const bidScores = evaluationScores[bidId] || {}
    let totalWeightedScore = 0
    let totalWeight = 0

    mockTender.evaluationCriteria.forEach(criteria => {
      const score = bidScores[criteria.name] || 0
      totalWeightedScore += (score * criteria.weight) / 100
      totalWeight += criteria.weight
    })

    return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0
  }

  const getPhaseStatus = (phaseId: string) => {
    const phaseIndex = phases.findIndex(p => p.id === phaseId)
    const currentIndex = phases.findIndex(p => p.id === currentPhase)

    if (phaseIndex < currentIndex) return 'completed'
    if (phaseIndex === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Tender Evaluation</h1>
          <p className="text-muted-foreground">
            Evaluate and score submitted bids according to evaluation criteria
          </p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700">
          {mockTender.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Tender Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mockTender.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Tender ID</Label>
              <p className="font-medium">{mockTender.id}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Agency</Label>
              <p className="font-medium">{mockTender.agency}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Category</Label>
              <p className="font-medium">{mockTender.category}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Estimated Value</Label>
              <p className="font-medium text-green-600">{mockTender.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {phases.map((phase, index) => {
              const Icon = phase.icon
              const status = getPhaseStatus(phase.id)
              return (
                <div key={phase.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    status === 'current' ? 'bg-blue-50 text-blue-700' :
                    status === 'completed' ? 'bg-green-50 text-green-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{phase.name}</span>
                    {status === 'completed' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  {index < phases.length - 1 && (
                    <div className={`w-8 h-px mx-2 ${
                      status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTender.evaluationCriteria.map(criteria => (
              <div key={criteria.name} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{criteria.name}</h4>
                  <Badge variant="secondary">{criteria.weight}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{criteria.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bid Evaluation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Bid Evaluation & Scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockBids.map(bid => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">{bid.supplier}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Bid ID: {bid.id}</span>
                      <span>Amount: <span className="font-medium text-green-600">{bid.amount}</span></span>
                      <span>Submitted: {bid.submittedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">{bid.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Documents
                    </Button>
                  </div>
                </div>

                {/* Scoring Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {mockTender.evaluationCriteria.map(criteria => (
                    <div key={criteria.name} className="space-y-2">
                      <Label className="text-sm">
                        {criteria.name} ({criteria.weight}%)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Score (0-100)"
                        value={evaluationScores[bid.id]?.[criteria.name] || ''}
                        onChange={(e) => handleScoreChange(bid.id, criteria.name, Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Weighted Score Display */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Weighted Score:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {calculateWeightedScore(bid.id).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Evaluation Report
        </Button>

        <div className="flex gap-2">
          <Button variant="outline">Save Progress</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Award className="h-4 w-4 mr-2" />
            Submit Evaluation
          </Button>
        </div>
      </div>
    </div>
  )
}
