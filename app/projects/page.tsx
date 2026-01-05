import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { ProjectsPageClient } from "@/components/projects-page-client"
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic';

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
    console.log('🔍 Querying database directly...');
    
    const projects = await query(`
      SELECT * FROM projects 
      WHERE is_published = 1 
      ORDER BY created_at DESC
    `);
    
    console.log('✅ Projects from DB:', projects.length);
    console.log('📦 Raw projects data:', JSON.stringify(projects, null, 2));
    
    return projects.map((project: any) => ({
      ...project,
      featured_image: project.featured_image || "/placeholder.svg",
      gallery_images: project.gallery_images && project.gallery_images !== 'null' 
        ? JSON.parse(project.gallery_images) 
        : [],
    }));
  } catch (error) {
    console.error('💥 Database query error:', error);
    return [];
  }
}

async function getStats() {
  const settingsMap: Record<string, string> = {
    "projects_completed": "200",
    "years_experience": "15",
    "team_size": "50",
    "clients_served": "75"
  };
  return settingsMap;
}

export default async function ProjectsPage() {
  let projects = []
  let stats = {}
  
  try {
    projects = await getProjects()
    stats = await getStats()
    
    console.log('🎯 Total projects fetched:', projects.length);
    console.log('📊 Projects being passed to client:', projects);
    
  } catch (error) {
    console.error('❌ Failed to fetch projects:', error)
    projects = []
    stats = {
      "projects_completed": "200",
      "years_experience": "15",
      "team_size": "50",
      "clients_served": "75"
    }
  }

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