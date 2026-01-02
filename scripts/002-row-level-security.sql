-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (for published content)
-- ============================================

-- Projects: Public can view published projects
CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (is_published = true);

-- News: Public can view published news
CREATE POLICY "Public can view published news" ON news
  FOR SELECT USING (is_published = true);

-- Services: Public can view active services
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Job Postings: Public can view active jobs
CREATE POLICY "Public can view active job postings" ON job_postings
  FOR SELECT USING (is_active = true);

-- Partners: Public can view active partners
CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (is_active = true);

-- Team Members: Public can view active team members
CREATE POLICY "Public can view active team members" ON team_members
  FOR SELECT USING (is_active = true);

-- Testimonials: Public can view active testimonials
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);

-- Site Settings: Public can read settings
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- ============================================
-- PUBLIC INSERT POLICIES (for form submissions)
-- ============================================

-- Contact Submissions: Anyone can submit contact form
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Job Applications: Anyone can apply for jobs
CREATE POLICY "Anyone can apply for jobs" ON job_applications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- AUTHENTICATED USER POLICIES (Admin Access)
-- ============================================

-- Admin Users: Authenticated users can view all admin users
CREATE POLICY "Authenticated users can view admin users" ON admin_users
  FOR SELECT TO authenticated USING (true);

-- Admin Users: Only super_admin can insert/update/delete admin users
CREATE POLICY "Super admin can manage admin users" ON admin_users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'super_admin'
    )
  );

-- Projects: Authenticated users have full access
CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- News: Authenticated users have full access
CREATE POLICY "Authenticated users can manage news" ON news
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Services: Authenticated users have full access
CREATE POLICY "Authenticated users can manage services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Job Postings: Authenticated users have full access
CREATE POLICY "Authenticated users can manage job postings" ON job_postings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Job Applications: Authenticated users can view/update applications
CREATE POLICY "Authenticated users can manage job applications" ON job_applications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contact Submissions: Authenticated users can view/update submissions
CREATE POLICY "Authenticated users can manage contact submissions" ON contact_submissions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site Settings: Authenticated users have full access
CREATE POLICY "Authenticated users can manage site settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Partners: Authenticated users have full access
CREATE POLICY "Authenticated users can manage partners" ON partners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Team Members: Authenticated users have full access
CREATE POLICY "Authenticated users can manage team members" ON team_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Testimonials: Authenticated users have full access
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Media Library: Authenticated users have full access
CREATE POLICY "Authenticated users can manage media library" ON media_library
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
