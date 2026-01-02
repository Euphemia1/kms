# Kolwezi Multi Services SARL Website

Official website for Kolwezi Multi Services SARL, a Democratic Republic of Congo registered company specializing in construction, mining support services, and logistics.

## Features

- Responsive design with modern UI
- Admin dashboard for content management
- Project portfolio showcase
- Career/job postings
- News and updates
- Contact form with database integration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI, Lucide Icons
- **Backend**: Next.js API Routes, PostgreSQL (via Supabase)
- **Authentication**: Custom session-based auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM
- MySQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kolwezi-company-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

4. Set up the database:
```bash
# For PostgreSQL (recommended):
# 1. 001-create-tables-postgres.sql
# 2. 002-seed-data-postgres.sql
# 3. 003-seed-initial-data-postgres.sql

# For MySQL (legacy):
# 1. 001-create-tables.sql
# 2. 002-row-level-security.sql
# 3. 002-seed-data.sql
# 4. 003-seed-initial-data.sql
```

5. Run the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

This project is configured for deployment on Vercel with Supabase as the database backend. Connect your GitHub repository to Vercel and set the following environment variables:

- DB_HOST (Your Supabase database host)
- DB_USER (Usually 'postgres')
- DB_PASSWORD (Your Supabase database password)
- DB_NAME (Usually 'postgres')
- DB_PORT (Usually '5432')

For local development, you can use the MySQL scripts, but for production deployment, PostgreSQL with Supabase is recommended.

## Admin Access

- URL: `/admin/login`
- Default credentials:
  - Email: admin@kmssarl.org
  - Password: admin123

**Important**: Change the default admin password after first login.

## Project Structure

```
app/              # Next.js App Router pages
components/       # React components
lib/              # Utility functions and database connection
scripts/          # Database setup scripts
public/           # Static assets
styles/           # Global styles
```

## License

This project is proprietary to Kolwezi Multi Services SARL.