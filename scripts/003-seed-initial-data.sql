-- ============================================
-- SEED INITIAL DATA
-- ============================================

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('company_name', 'KMS SARL', 'text', 'Company name'),
  ('company_tagline', 'Building Excellence in the Heart of Congo', 'text', 'Company tagline'),
  ('company_email', 'info@kmssarl.org', 'text', 'Main company email'),
  ('company_phone', '+243 XXX XXX XXX', 'text', 'Main company phone'),
  ('company_address', 'Kolwezi, Lualaba Province, Democratic Republic of Congo', 'text', 'Company address'),
  ('hero_title', 'Building Tomorrow''s Infrastructure Today', 'text', 'Homepage hero title'),
  ('hero_subtitle', 'Premier construction, mining support, and logistics services in the Democratic Republic of Congo', 'text', 'Homepage hero subtitle'),
  ('about_short', 'KMS SARL is a leading provider of integrated services in construction, logistics, mining support, procurement, and consulting in the DRC.', 'text', 'Short about text'),
  ('years_experience', '15', 'number', 'Years of experience'),
  ('projects_completed', '200', 'number', 'Number of completed projects'),
  ('team_size', '500', 'number', 'Number of employees'),
  ('clients_served', '50', 'number', 'Number of clients served')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default services
INSERT INTO services (title, slug, short_description, full_description, icon, features, sort_order, is_active) VALUES
  (
    'Construction & Civil Engineering',
    'construction',
    'Complete construction solutions from residential buildings to major infrastructure projects.',
    'We deliver comprehensive construction services including commercial buildings, residential complexes, road construction, and infrastructure development. Our experienced team ensures quality, safety, and timely delivery on every project.',
    'Building2',
    ARRAY['Commercial & Residential Buildings', 'Road & Bridge Construction', 'Infrastructure Development', 'Project Management', 'Quality Assurance'],
    1,
    true
  ),
  (
    'Mining Support Services',
    'mining-support',
    'Specialized support services for mining operations across the copper belt.',
    'We provide essential support services to mining companies including site preparation, equipment maintenance, logistics coordination, and workforce management. Our expertise ensures smooth mining operations.',
    'Pickaxe',
    ARRAY['Site Preparation & Development', 'Equipment Maintenance', 'Logistics Coordination', 'Workforce Management', 'Safety Compliance'],
    2,
    true
  ),
  (
    'Logistics & Transportation',
    'logistics',
    'Efficient logistics solutions connecting mines, cities, and international markets.',
    'Our logistics division offers comprehensive transportation services including heavy equipment hauling, material delivery, fleet management, and supply chain optimization.',
    'Truck',
    ARRAY['Heavy Equipment Transport', 'Material Delivery', 'Fleet Management', 'Supply Chain Solutions', 'Customs Clearance'],
    3,
    true
  ),
  (
    'Procurement Services',
    'procurement',
    'Strategic sourcing and procurement for construction and mining industries.',
    'We streamline your procurement process with our extensive supplier network, competitive pricing, and efficient delivery systems. From raw materials to specialized equipment.',
    'Package',
    ARRAY['Strategic Sourcing', 'Supplier Management', 'Inventory Control', 'Cost Optimization', 'Quality Verification'],
    4,
    true
  ),
  (
    'Engineering Consulting',
    'consulting',
    'Expert engineering and project consulting services for complex projects.',
    'Our consulting team provides feasibility studies, project planning, technical advisory, and regulatory compliance guidance to ensure project success.',
    'Lightbulb',
    ARRAY['Feasibility Studies', 'Project Planning', 'Technical Advisory', 'Regulatory Compliance', 'Risk Assessment'],
    5,
    true
  ),
  (
    'Equipment Rental',
    'equipment-rental',
    'Wide range of construction and mining equipment available for rent.',
    'Access our fleet of well-maintained construction and mining equipment. From excavators to trucks, we have the machinery you need for your projects.',
    'Wrench',
    ARRAY['Excavators & Loaders', 'Trucks & Haulers', 'Cranes & Lifts', 'Compactors & Rollers', 'Maintenance Support'],
    6,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, slug, description, full_description, category, client, location, status, is_featured, is_published) VALUES
  (
    'Kolwezi Highway Extension',
    'kolwezi-highway-extension',
    '45km highway expansion connecting mining districts to main transportation routes.',
    'A major infrastructure project extending the Kolwezi highway system to better connect mining operations with transportation hubs. The project includes road construction, drainage systems, and safety installations.',
    'construction',
    'Ministry of Infrastructure',
    'Kolwezi, Lualaba',
    'completed',
    true,
    true
  ),
  (
    'Copper Mine Site Development',
    'copper-mine-site-development',
    'Complete site preparation and infrastructure for new copper mining operation.',
    'Comprehensive site development including access roads, utilities installation, and support facilities for a major copper mining operation in the Lualaba region.',
    'mining',
    'Major Mining Corporation',
    'Lualaba Province',
    'completed',
    true,
    true
  ),
  (
    'Industrial Logistics Hub',
    'industrial-logistics-hub',
    'State-of-the-art logistics center serving the mining industry.',
    'Design and construction of a modern logistics facility featuring warehousing, vehicle maintenance bays, and administrative offices to support regional mining operations.',
    'logistics',
    'Regional Mining Consortium',
    'Kolwezi',
    'ongoing',
    true,
    true
  ),
  (
    'Commercial Complex Development',
    'commercial-complex-development',
    'Multi-story commercial building in downtown Kolwezi.',
    'A landmark commercial development featuring retail spaces, office suites, and modern amenities. This project represents our commitment to urban development in the region.',
    'construction',
    'Private Developer',
    'Kolwezi City Center',
    'ongoing',
    false,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample news articles
INSERT INTO news (title, slug, excerpt, content, category, author_name, is_featured, is_published, published_at) VALUES
  (
    'KMS SARL Wins Major Infrastructure Contract',
    'kms-wins-major-infrastructure-contract',
    'KMS SARL has been awarded a significant contract for road infrastructure development in Lualaba Province.',
    'We are proud to announce that KMS SARL has been selected as the primary contractor for a major road infrastructure project in Lualaba Province. This contract represents our continued growth and the trust our clients place in our capabilities. The project will span over 18 months and create numerous employment opportunities for local communities.',
    'company',
    'KMS Communications',
    true,
    true,
    NOW() - INTERVAL '5 days'
  ),
  (
    'Safety Excellence Award 2024',
    'safety-excellence-award-2024',
    'KMS SARL receives recognition for outstanding safety performance across all operations.',
    'Our commitment to safety has been recognized with the Safety Excellence Award for 2024. This achievement reflects the dedication of our entire team to maintaining the highest safety standards in all our construction and mining support operations.',
    'company',
    'KMS Communications',
    false,
    true,
    NOW() - INTERVAL '15 days'
  ),
  (
    'Expanding Our Fleet Capacity',
    'expanding-fleet-capacity',
    'KMS SARL invests in new equipment to better serve our growing client base.',
    'To meet increasing demand, we have expanded our equipment fleet with new excavators, trucks, and specialized mining support machinery. This investment ensures we can deliver on our commitments while maintaining the highest quality standards.',
    'company',
    'KMS Communications',
    false,
    true,
    NOW() - INTERVAL '30 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample job postings
INSERT INTO job_postings (title, slug, department, location, employment_type, experience_level, description, requirements, responsibilities, is_active) VALUES
  (
    'Senior Civil Engineer',
    'senior-civil-engineer',
    'Engineering',
    'Kolwezi, DRC',
    'full-time',
    'senior',
    'We are seeking an experienced Civil Engineer to lead major construction projects and mentor junior team members.',
    ARRAY['Bachelor''s degree in Civil Engineering', '7+ years of experience', 'Professional engineering license', 'Experience with large-scale infrastructure projects', 'Strong leadership skills'],
    ARRAY['Lead project design and execution', 'Manage engineering team', 'Ensure quality and safety compliance', 'Client relationship management', 'Budget and timeline oversight'],
    true
  ),
  (
    'Logistics Coordinator',
    'logistics-coordinator',
    'Operations',
    'Kolwezi, DRC',
    'full-time',
    'mid',
    'Join our logistics team to coordinate transportation and supply chain operations for our mining and construction clients.',
    ARRAY['Bachelor''s degree in Logistics or related field', '3+ years of experience', 'Knowledge of regional transportation networks', 'Strong organizational skills', 'Proficiency in logistics software'],
    ARRAY['Coordinate daily logistics operations', 'Manage fleet scheduling', 'Optimize supply chain efficiency', 'Maintain vendor relationships', 'Ensure timely deliveries'],
    true
  ),
  (
    'Heavy Equipment Operator',
    'heavy-equipment-operator',
    'Operations',
    'Kolwezi, DRC',
    'full-time',
    'mid',
    'Operate various heavy equipment for construction and mining support operations.',
    ARRAY['Valid heavy equipment operator certification', '3+ years of experience', 'Safety training certifications', 'Ability to work in challenging environments', 'Basic mechanical knowledge'],
    ARRAY['Operate excavators, loaders, and trucks', 'Perform daily equipment inspections', 'Follow safety protocols', 'Report maintenance needs', 'Support project completion'],
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (full_name, position, department, bio, is_leadership, sort_order, is_active) VALUES
  ('Jean-Pierre Mukendi', 'Chief Executive Officer', 'Executive', 'With over 20 years of experience in construction and mining, Jean-Pierre leads KMS SARL with a vision for excellence and sustainable growth.', true, 1, true),
  ('Marie-Claire Kabongo', 'Chief Operations Officer', 'Executive', 'Marie-Claire oversees all operational activities, ensuring efficient delivery across our construction, logistics, and mining support services.', true, 2, true),
  ('Patrick Ilunga', 'Chief Financial Officer', 'Finance', 'Patrick brings extensive financial expertise to ensure KMS SARL''s continued growth and financial stability.', true, 3, true),
  ('Sophie Mwamba', 'Director of Engineering', 'Engineering', 'Sophie leads our engineering team, bringing innovation and technical excellence to every project.', true, 4, true)
ON CONFLICT DO NOTHING;

-- Insert sample partners
INSERT INTO partners (name, description, partner_type, sort_order, is_active) VALUES
  ('Gécamines', 'National mining company partnership', 'partner', 1, true),
  ('Ministry of Infrastructure', 'Government infrastructure projects', 'client', 2, true),
  ('Tenke Fungurume Mining', 'Mining support services client', 'client', 3, true),
  ('ISO 9001:2015', 'Quality Management Certification', 'certification', 4, true),
  ('ISO 45001:2018', 'Occupational Health & Safety Certification', 'certification', 5, true)
ON CONFLICT DO NOTHING;
