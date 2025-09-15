import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Search,
  FileText,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Award,
  Building2,
  Globe,
  CheckCircle
} from 'lucide-react'

// This would typically come from the database
const mockStats = {
  openTenders: 45,
  totalSuppliers: 1250,
  recentAwards: 89,
  totalSpend: "K 125.4M"
}

const recentTenders = [
  {
    id: "TND-2025-001",
    title: "Medical Equipment Supply for National Hospital",
    agency: "Department of Health",
    category: "GOODS",
    value: "K 2.5M",
    deadline: "2025-01-25",
    status: "PUBLISHED"
  },
  {
    id: "TND-2025-002",
    title: "Road Rehabilitation Project - Highlands Highway",
    agency: "Department of Works",
    category: "WORKS",
    value: "K 15.2M",
    deadline: "2025-01-30",
    status: "PUBLISHED"
  },
  {
    id: "TND-2025-003",
    title: "IT Infrastructure Consulting Services",
    agency: "Department of Finance",
    category: "CONSULTING",
    value: "K 800K",
    deadline: "2025-01-28",
    status: "PUBLISHED"
  }
]

const features = [
  {
    icon: Shield,
    title: "Transparent & Secure",
    description: "Full transparency with secure, encrypted bid submissions and public tender listings."
  },
  {
    icon: Globe,
    title: "Equal Access",
    description: "SMEs, provincial contractors, and international bidders can participate on equal footing."
  },
  {
    icon: CheckCircle,
    title: "NPC Compliant",
    description: "Fully compliant with National Procurement Commission regulations and procedures."
  },
  {
    icon: TrendingUp,
    title: "Efficient Process",
    description: "Streamlined procurement lifecycle from planning to payment with automated workflows."
  }
]

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
            PNG e-Government Procurement
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A secure, transparent, and efficient e-Government Procurement platform
            for Papua New Guinea's National Procurement Commission
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tenders">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Search className="mr-2 h-5 w-5" />
              Browse Open Tenders
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              Register as Supplier
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.openTenders}</div>
            <p className="text-xs text-muted-foreground">Currently accepting bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">Verified and active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.recentAwards}</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Procurement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalSpend}</div>
            <p className="text-xs text-muted-foreground">2024 fiscal year</p>
          </CardContent>
        </Card>
      </section>

      {/* Recent Tenders */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Recent Tenders</h2>
          <Link href="/tenders">
            <Button variant="outline">
              View All Tenders
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {recentTenders.map((tender) => (
            <Card key={tender.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{tender.title}</CardTitle>
                      <Badge variant="secondary">{tender.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {tender.agency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Deadline: {new Date(tender.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{tender.value}</div>
                    <Badge className="bg-green-100 text-green-800">
                      {tender.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Tender No: {tender.id}
                  </span>
                  <Link href={`/tenders/${tender.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Choose PNG e-GP?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform modernizes government procurement with transparency,
            efficiency, and equal opportunities for all suppliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-600 to-yellow-600 rounded-lg p-8 text-center text-white">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Participate?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of suppliers already using PNG e-GP to access
            government procurement opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Register Now
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
