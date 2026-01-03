import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  sort_order: number
  is_active: boolean
  featured_images?: string
  created_at: string
  updated_at: string
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const service = await queryOne<Service>("SELECT * FROM services WHERE id = ?", [id])

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
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
    let featured_images_urls: string[] = [];
    
    // Check if request is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Process image files if present
      const imageFiles = formData.getAll('featured_images_files') as File[];
      if (imageFiles && imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          // Convert file to buffer
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          
          const fileName = `${Date.now()}-${imageFile.name}`;
          const filePath = join(process.cwd(), 'public', 'uploads', 'services', fileName);
          
          try {
            // Write file to public directory so it can be served
            await writeFile(filePath, buffer);
            featured_images_urls.push(`/uploads/services/${fileName}`);
            console.log(`Image file saved successfully: ${fileName}, size: ${imageFile.size}, type: ${imageFile.type}`);
          } catch (error) {
            console.error('Error saving image file:', error);
          }
        }
      }
      
      // Get other form fields
      data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        short_description: formData.get('short_description') as string,
        full_description: formData.get('full_description') as string || null,
        icon: formData.get('icon') as string,
        sort_order: parseInt(formData.get('sort_order') as string) || 0,
        is_active: formData.get('is_active') === 'true',
        // Use the uploaded image URLs instead of the form field
        featured_images: featured_images_urls,
      };
    } else {
      // Handle JSON request
      data = await request.json();
    }

    await execute(
      `UPDATE services SET 
        title = ?, slug = ?, short_description = ?, full_description = ?, 
        icon = ?, sort_order = ?, is_active = ?, featured_images = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.short_description,
        data.full_description,
        data.icon,
        data.sort_order || 0,
        data.is_active !== undefined ? data.is_active : true,
        data.featured_images && data.featured_images.length > 0 ? JSON.stringify(data.featured_images) : JSON.stringify([]),
        id,
      ],
    )

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await execute("DELETE FROM services WHERE id = ?", [id])

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}