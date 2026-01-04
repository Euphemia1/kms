import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

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
  featured_video: string
  is_featured: boolean
  is_published: boolean
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await queryOne<Project>("SELECT id, title, slug, description, full_description, category, client, location, start_date, end_date, status, featured_image, featured_video, is_featured, is_published FROM projects WHERE id = ?", [id])

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
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

    await execute(
      `UPDATE projects SET title = ?, slug = ?, description = ?, full_description = ?, category = ?, client = ?, location = ?, start_date = ?, end_date = ?, status = ?, featured_image = ?, featured_video = ?, is_featured = ?, is_published = ? WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.description || null,
        data.full_description || null,
        data.category,
        data.client || null,
        data.location || null,
        data.start_date || null,
        data.end_date || null,
        data.status,
        data.featured_image || null, // Use the processed image URL
        data.featured_video || null, // Use the processed video URL
        data.is_featured ? 1 : 0,
        data.is_published ? 1 : 0,
        id,
      ],
    )

    // Revalidate the projects page
    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await execute("DELETE FROM projects WHERE id = ?", [id])

    // Revalidate the projects page
    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

