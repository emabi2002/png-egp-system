# PNG e-Government Procurement (e-GP) System

A secure, transparent, and efficient e-Government Procurement platform for Papua New Guinea's National Procurement Commission.

## About

The PNG e-Government Procurement System is a comprehensive digital platform designed to modernize and streamline the procurement processes for Papua New Guinea's government agencies.

## Key Features

### Multi-Role Authentication
- Government Agencies - Tender creation and management
- Suppliers - Bid submission and profile management
- NPC Administrators - System oversight and compliance
- Public Users - Tender browsing and transparency

### Comprehensive Tender Management
- 6-Step Tender Creation Wizard with validation
- Document Management with secure uploads
- Evaluation Criteria and scoring systems
- Timeline Management with automated notifications
- Public Tender Portal with advanced search and filtering

### Supplier Portal
- Registration & KYC Verification
- Bid Submission with document attachments
- Profile Management and compliance tracking
- Bid History and status monitoring

## Technology Stack

- Framework: Next.js 15 with App Router
- Language: TypeScript for type safety
- Authentication: NextAuth.js with Prisma adapter
- Database: SQLite with Prisma ORM
- UI: Radix UI + shadcn/ui components
- Styling: Tailwind CSS with custom PNG government theme

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/npipng393-web/egp.git
   cd egp
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Initialize the database:
   ```bash
   bun run prisma generate
   bun run prisma db push
   ```

5. Seed test data:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. Start development server:
   ```bash
   bun run dev
   ```

## Test Credentials

- Admin: admin@npc.gov.pg / TestAdmin123!

## Deployment

Ready for Netlify deployment with the following build settings:
- Build command: npm run build
- Publish directory: .next
- Node version: 18+

Built for Papua New Guinea's digital transformation.
