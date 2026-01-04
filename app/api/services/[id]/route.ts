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
  featured_image?: string | null
  gallery_images?: string[] | null
  features?: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const service = await queryOne<any>("SELECT * FROM services WHERE id = ?", [id])

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    
    // Parse gallery_images from JSON string if it exists
    const processedService = {
      ...service,
      gallery_images: service.gallery_images && service.gallery_images !== 'null' ? JSON.parse(service.gallery_images) || [] : [],
      features: service.features ? JSON.parse(service.features) : [],
    };
    
    return NextResponse.json(processedService)
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
    let featured_image_url: string | null = null;
    let gallery_images_urls: string[] = [];
    
    // Check if request is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Process featured image file if present
      const featuredImageFile = formData.get('featured_image_file') as File | null;
      if (featuredImageFile) {
        // Convert file to buffer
        const buffer = Buffer.from(await featuredImageFile.arrayBuffer());
        
        const fileName = `${Date.now()}-${featuredImageFile.name}`;
        const filePath = join(process.cwd(), 'public', 'uploads', 'services', fileName);
        
        try {
          // Write file to public directory so it can be served
          await writeFile(filePath, buffer);
          featured_image_url = `/uploads/services/${fileName}`;
          console.log(`Featured image file saved successfully: ${fileName}, size: ${featuredImageFile.size}, type: ${featuredImageFile.type}`);
        } catch (error) {
          console.error('Error saving featured image file:', error);
        }
      }
      
      // Process gallery image files if present
      const galleryImageFiles = formData.getAll('gallery_images') as File[];
      if (galleryImageFiles && galleryImageFiles.length > 0) {
        for (const imageFile of galleryImageFiles) {
          // Convert file to buffer
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          
          const fileName = `${Date.now()}-${imageFile.name}`;
          const filePath = join(process.cwd(), 'public', 'uploads', 'services', fileName);
          
          try {
            // Write file to public directory so it can be served
            await writeFile(filePath, buffer);
            gallery_images_urls.push(`/uploads/services/${fileName}`);
            console.log(`Gallery image file saved successfully: ${fileName}, size: ${imageFile.size}, type: ${imageFile.type}`);
          } catch (error) {
            console.error('Error saving gallery image file:', error);
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
        features: formData.get('features') as string || null,
        sort_order: parseInt(formData.get('sort_order') as string) || 0,
        is_active: formData.get('is_active') === 'true',
        featured_image: featured_image_url,
        gallery_images: gallery_images_urls,
      };
    } else {
      // Handle JSON request
      data = await request.json();
    }

    await execute(
      `UPDATE services SET 
        title = ?, slug = ?, short_description = ?, full_description = ?, 
        icon = ?, featured_image = ?, gallery_images = ?, features = ?, 
        sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.short_description,
        data.full_description,
        data.icon,
        data.featured_image || null,
        data.gallery_images && data.gallery_images.length > 0 ? JSON.stringify(data.gallery_images) : null,
        data.features && data.features.length > 0 ? data.features : null,
        data.sort_order || 0,
        data.is_active !== undefined ? data.is_active : true,
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