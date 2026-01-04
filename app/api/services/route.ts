import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
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

export async function GET() {
  try {
    const services = await query<any>(`SELECT id, title, slug, short_description, full_description, icon, featured_image, gallery_images, features, sort_order, is_active, created_at, updated_at FROM services WHERE is_active = TRUE ORDER BY sort_order ASC`)
    
    // Process the services to parse JSON fields
    const processedServices = services.map(service => ({
      ...service,
      gallery_images: service.gallery_images && service.gallery_images !== 'null' ? JSON.parse(service.gallery_images) || [] : [],
      features: service.features ? JSON.parse(service.features) : [],
    }));
    
    return NextResponse.json(processedServices)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const serviceId = uuidv4();
    await execute(
      `INSERT INTO services (
        id, title, slug, short_description, full_description, icon, featured_image, gallery_images, features, sort_order, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceId,
        data.title,
        data.slug,
        data.short_description,
        data.full_description,
        data.icon,
        data.featured_image || null,
        data.gallery_images && data.gallery_images.length > 0 ? JSON.stringify(data.gallery_images) : null,
        data.features && data.features.length > 0 ? data.features : null,
        data.sort_order || 0,
        data.is_active !== undefined ? data.is_active : true
      ]
    )

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ 
      error: "Failed to create service",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Add PUT method for updating services
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params;
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
      `UPDATE services 
       SET 
         title = ?, 
         slug = ?, 
         short_description = ?, 
         full_description = ?, 
         icon = ?, 
         featured_image = ?,
         gallery_images = ?,
         features = ?,
         sort_order = ?,
         is_active = ?
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
        id
      ]
    )

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ 
      error: "Failed to update service",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}