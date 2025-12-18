import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { query } from "@/lib/db"
import { ProjectsPageClient } from "@/components/projects-page-client"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  full_description: string
  category: string
  client: string
  location: string
  start_date: string
  end_date: string
  status: string
  featured_image: string
  is_featured: boolean
}

interface SiteSetting {
  setting_key: string
  setting_value: string
}

async function getProjects() {
  // Mock data for projects
  const projects: Project[] = [
    {
      id: "1",
      title: "Mutanda Mining Expansion Project",
      slug: "mutanda-mining-expansion",
      description: "Expansion of mining operations at Mutanda site with increased processing capacity.",
      full_description: "Comprehensive expansion of the Mutanda Mining facility including new processing units, upgraded infrastructure, and enhanced safety systems. This project demonstrates our capability in large-scale mining operations.",
      category: "mining",
      client: "Mutanda Mining SA",
      location: "Katanga Province, DRC",
      start_date: "2023-01-15",
      end_date: "2024-12-15",
      status: "ongoing",
      featured_image: "/services/mining.jpg",
      is_featured: true
    },
    {
      id: "2",
      title: "Kamoto Copper Infrastructure Upgrade",
      slug: "kamoto-copper-infrastructure",
      description: "Complete infrastructure overhaul for Kamoto Copper processing facility.",
      full_description: "Modernization of the Kamoto Copper Company's infrastructure including electrical systems, water treatment facilities, and transportation networks. This project showcases our expertise in industrial infrastructure development.",
      category: "construction",
      client: "Kamoto Copper Company",
      location: "Lualaba Province, DRC",
      start_date: "2022-03-10",
      end_date: "2023-11-30",
      status: "completed",
      featured_image: "/services/construction.jpg",
      is_featured: true
    },
    {
      id: "3",
      title: "Kolwezi Logistics Hub",
      slug: "kolwezi-logistics-hub",
      description: "Development of a state-of-the-art logistics hub for mining operations.",
      full_description: "Design and construction of a comprehensive logistics hub to support mining operations in the region. The facility includes warehousing, fleet maintenance, and administrative offices.",
      category: "logistics",
      client: "Regional Mining Consortium",
      location: "Kolwezi, Lualaba Province, DRC",
      start_date: "2023-06-01",
      end_date: "2024-08-30",
      status: "ongoing",
      featured_image: "/services/logistics.jpg",
      is_featured: false
    }
  ];
  return projects;
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
