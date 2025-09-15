'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Award,
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  Send,
  Download,
  Calendar,
  DollarSign,
  Building2,
  Clock
} from 'lucide-react'

// Mock evaluation results - would come from API
const mockEvaluationResults = {
  tender: {
    id: 'TND-2025-001',
    title: 'Medical Equipment Supply for National Hospital',
    agency: 'Department of Health',
    estimatedValue: 'K 2.5M',
    evaluationCompleted: '2025-01-28'
  },
  rankedBids: [
    {
      id: 'BID-001',
      supplier: 'MedEquip PNG Ltd',
      amount: 'K 2.2M',
      weightedScore: 87.5,
      rank: 1,
      technicalScore: 92,
      financialScore: 85,
      localContent: 'Yes - 60%',
      recommendation: 'RECOMMENDED'
    },
    {
      id: 'BID-002',
      supplier: 'Pacific Medical Supplies',
      amount: 'K 2.4M',
      weightedScore: 82.3,
      rank: 2,
      technicalScore: 88,
      financialScore: 78,
      localContent: 'Yes - 40%',
      recommendation: 'ALTERNATE'
    },
    {
      id: 'BID-003',
      supplier: 'Global Healthcare Solutions',
      amount: 'K 1.9M',
      weightedScore: 71.8,
      rank: 3,
      technicalScore: 75,
      financialScore: 90,
      localContent: 'No - 10%',
      recommendation: 'NOT_RECOMMENDED'
    }
  ]
}

export default function TenderAwardPage() {
  const params = useParams()
  const [selectedBid, setSelectedBid] = useState(mockEvaluationResults.rankedBids[0])
  const [awardDetails, setAwardDetails] = useState({
    contractValue: selectedBid.amount,
    contractPeriod: '12 months',
    startDate: '',
    endDate: '',
    performanceBond: '5%',
    specialConditions: ''
  })
  const [npcApprovalRequired, setNpcApprovalRequired] = useState(true)

  const handleAwardBid = () => {
    // Award process implementation
    console.log('Awarding bid to:', selectedBid.supplier)
    console.log('Award details:', awardDetails)
  }

  const generateContract = () => {
    // Contract generation implementation
    console.log('Generating contract for:', selectedBid.supplier)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Tender Award</h1>
          <p className="text-muted-foreground">
            Review evaluation results and award contract to successful bidder
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          READY FOR AWARD
        </Badge>
      </div>

      {/* Tender Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mockEvaluationResults.tender.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Tender ID</Label>
              <p className="font-medium">{mockEvaluationResults.tender.id}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Agency</Label>
              <p className="font-medium">{mockEvaluationResults.tender.agency}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Estimated Value</Label>
              <p className="font-medium text-green-600">{mockEvaluationResults.tender.estimatedValue}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Evaluation Completed</Label>
              <p className="font-medium">{mockEvaluationResults.tender.evaluationCompleted}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Evaluation Results & Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvaluationResults.rankedBids.map((bid, index) => (
              <div
                key={bid.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedBid.id === bid.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedBid(bid)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`
                        ${bid.rank === 1 ? 'bg-green-100 text-green-800' :
                          bid.rank === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        Rank #{bid.rank}
                      </Badge>
                      <h4 className="font-medium text-lg">{bid.supplier}</h4>
                      <Badge variant={
                        bid.recommendation === 'RECOMMENDED' ? 'default' :
                        bid.recommendation === 'ALTERNATE' ? 'secondary' : 'outline'
                      }>
                        {bid.recommendation}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Bid Amount</Label>
                        <p className="font-medium text-green-600">{bid.amount}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Weighted Score</Label>
                        <p className="font-medium">{bid.weightedScore}%</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Technical</Label>
                        <p className="font-medium">{bid.technicalScore}%</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Financial</Label>
                        <p className="font-medium">{bid.financialScore}%</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Local Content</Label>
                        <p className="font-medium">{bid.localContent}</p>
                      </div>
                    </div>
                  </div>

                  {bid.rank === 1 && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Award Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Award Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Selected Supplier Info */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Selected Supplier: {selectedBid.supplier}</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Bid ID</Label>
                  <p className="font-medium">{selectedBid.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contract Value</Label>
                  <p className="font-medium text-green-600">{selectedBid.amount}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Overall Score</Label>
                  <p className="font-medium">{selectedBid.weightedScore}%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ranking</Label>
                  <p className="font-medium">#{selectedBid.rank}</p>
                </div>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contractValue">Contract Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contractValue"
                      value={awardDetails.contractValue}
                      onChange={(e) => setAwardDetails(prev => ({...prev, contractValue: e.target.value}))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contractPeriod">Contract Period</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contractPeriod"
                      value={awardDetails.contractPeriod}
                      onChange={(e) => setAwardDetails(prev => ({...prev, contractPeriod: e.target.value}))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="performanceBond">Performance Bond</Label>
                  <Input
                    id="performanceBond"
                    value={awardDetails.performanceBond}
                    onChange={(e) => setAwardDetails(prev => ({...prev, performanceBond: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Contract Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={awardDetails.startDate}
                      onChange={(e) => setAwardDetails(prev => ({...prev, startDate: e.target.value}))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="endDate">Contract End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      value={awardDetails.endDate}
                      onChange={(e) => setAwardDetails(prev => ({...prev, endDate: e.target.value}))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialConditions">Special Conditions</Label>
                  <Textarea
                    id="specialConditions"
                    value={awardDetails.specialConditions}
                    onChange={(e) => setAwardDetails(prev => ({...prev, specialConditions: e.target.value}))}
                    placeholder="Any special contract conditions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NPC Approval */}
      {npcApprovalRequired && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              NPC Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                This contract award requires approval from the National Procurement Commission
                as the value exceeds departmental threshold limits. The award recommendation
                will be submitted to NPC for final approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Evaluation Report
          </Button>
          <Button variant="outline" onClick={generateContract}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Draft Contract
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleAwardBid} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4 mr-2" />
            {npcApprovalRequired ? 'Submit for NPC Approval' : 'Award Contract'}
          </Button>
        </div>
      </div>
    </div>
  )
}
