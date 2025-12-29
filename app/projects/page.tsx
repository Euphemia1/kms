import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { ProjectsPageClient } from "@/components/projects-page-client"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  full_description: string | null
  category: string
  client: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  status: string
  featured_image: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
}

interface SiteSetting {
  setting_key: string
  setting_value: string
}

async function getProjects() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${siteUrl}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour for production
    });
    
    if (!res.ok) {
      console.error('Failed to fetch projects:', res.status, res.statusText);
      // Return empty array instead of mock data
      return [];
    }
    
    const projects = await res.json();
    
    // Ensure projects are properly formatted
    return projects.map((project: any) => ({
      ...project,
      featured_image: project.featured_image || "/placeholder.svg", // Provide a default image if none exists
    }));
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

async function getStats() {
  // Mock data for stats
  const settingsMap: Record<string, string> = {
    "projects_completed": "200",
    "years_experience": "15",
    "team_size": "50",
    "clients_served": "75"
  };
  return settingsMap;
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const stats = await getStats()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Our Projects</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Building <span className="text-primary">Excellence</span> Across DRC
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our portfolio of successfully completed and ongoing projects across construction, mining,
              logistics, and infrastructure sectors.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Projects Client Component */}
      <ProjectsPageClient projects={projects} stats={stats} />

      <Footer />
    </main>
  )
}
