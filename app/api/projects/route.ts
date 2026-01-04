import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { writeFile } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"


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
  featured_video: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
}


export async function GET() {
  try {
    const projects = await query<Project>("SELECT id, title, slug, description, full_description, category, client, location, start_date, end_date, status, featured_image, featured_video, is_featured, is_published, created_at FROM projects WHERE is_published = TRUE ORDER BY created_at DESC")
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    // Get session - this returns { user, session } or null
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let data;
    let featured_image_url: string | null = null;
    let featured_video_url: string | null = null;
    
    // Check if request is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Process image file if present
      const imageFile = formData.get('featured_image_file') as File | null;
      if (imageFile) {
        // Convert file to buffer
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        const fileName = `${Date.now()}-${imageFile.name}`;
        const filePath = join(process.cwd(), 'public', 'uploads', 'projects', fileName);
        
        try {
          // Write file to public directory so it can be served
          await writeFile(filePath, buffer);
          featured_image_url = `/uploads/projects/${fileName}`;
          console.log(`File saved successfully: ${fileName}, size: ${imageFile.size}, type: ${imageFile.type}`);
        } catch (error) {
          console.error('Error saving file:', error);
          // Fallback to not setting an image if save fails
          featured_image_url = null;
        }
      }
      
      // Process video file if present
      const videoFile = formData.get('featured_video_file') as File | null;
      if (videoFile) {
        // Convert file to buffer
        const buffer = Buffer.from(await videoFile.arrayBuffer());
        
        const fileName = `${Date.now()}-${videoFile.name}`;
        const filePath = join(process.cwd(), 'public', 'uploads', 'projects', fileName);
        
        try {
          // Write file to public directory so it can be served
          await writeFile(filePath, buffer);
          featured_video_url = `/uploads/projects/${fileName}`;
          console.log(`Video file saved successfully: ${fileName}, size: ${videoFile.size}, type: ${videoFile.type}`);
        } catch (error) {
          console.error('Error saving video file:', error);
          // Fallback to not setting a video if save fails
          featured_video_url = null;
        }
      }
      
      // Get other form fields
      data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        full_description: formData.get('full_description') as string || null,
        category: formData.get('category') as string,
        client: formData.get('client') as string || null,
        location: formData.get('location') as string || null,
        start_date: formData.get('start_date') as string || null,
        end_date: formData.get('end_date') as string || null,
        status: formData.get('status') as string,
        is_featured: formData.get('is_featured') === 'true',
        is_published: formData.get('is_published') === 'true',
        // Use the uploaded image and video URLs instead of the form fields
        featured_image: featured_image_url,
        featured_video: featured_video_url,
      };
    } else {
      // Handle JSON request
      data = await request.json();
    }

    const projectId = uuidv4();
    // Insert project
    await execute(
      `INSERT INTO projects (
        id, title, slug, description, full_description, category,
        client, location, start_date, end_date, status,
        featured_image, featured_video, gallery_images, is_featured, is_published, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        data.title,
        data.slug,
        data.description,
        data.full_description,
        data.category,
        data.client,
        data.location,
        data.start_date,
        data.end_date,
        data.status,
        data.featured_image,
        data.featured_video || null,
        null, // gallery_images - not implemented in form yet
        data.is_featured,
        data.is_published,
        session.user.id
      ]
    );


    // Revalidate the projects page
    revalidatePath('/projects');
    revalidatePath('/admin/projects');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ 
      error: "Failed to create project",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
