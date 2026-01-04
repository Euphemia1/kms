-- KMS SARL Seed Data for PostgreSQL
-- Run this after creating tables

-- ============================================
-- CREATE ADMIN USER (password: admin123 - CHANGE THIS!)
-- Password hash generated with bcrypt for 'admin123'
-- ============================================
INSERT INTO admin_users (id, email, password_hash, full_name, role) VALUES
('a1b2c3d4-e5f6-4890-abcd-ef1234567890', 'admin@kmssarl.org', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrqd8aA/jphcNpYJMXJqj3UmLvH4R.W', 'KMS Administrator', 'super_admin');

-- ============================================
-- SERVICES DATA
-- ============================================
INSERT INTO services (id, title, slug, short_description, full_description, icon, sort_order, is_active) VALUES
('b1c2d3e4-f5f6-4890-abcd-ef1234567891', 'Construction & Civil Works', 'construction', 'Comprehensive construction services including residential, commercial, and industrial projects.', 'KMS SARL delivers exceptional construction and civil engineering services throughout the Democratic Republic of Congo. From residential developments to large-scale industrial facilities, our experienced team ensures quality craftsmanship, timely delivery, and strict adherence to safety standards.', 'Building2', 1, TRUE),
('c1d2e3f4-g5g6-4890-abcd-ef1234567892', 'Mining Support Services', 'mining-support', 'Specialized support services for mining operations including equipment and technical expertise.', 'We provide comprehensive mining support services tailored to the unique challenges of the Congolese mining sector. Our services include equipment supply, maintenance, technical consulting, and workforce solutions designed to optimize your mining operations.', 'Pickaxe', 2, TRUE),
('d1e2f3g4-h5h6-4890-abcd-ef1234567893', 'Logistics & Transportation', 'logistics', 'Efficient logistics solutions for cargo transportation and supply chain management.', 'KMS SARL offers reliable logistics and transportation services across the DRC. Our fleet and logistics expertise ensure safe, timely delivery of goods, equipment, and materials to even the most remote locations.', 'Truck', 3, TRUE),
('e1f2g3h4-i5i6-4890-abcd-ef1234567894', 'Procurement Services', 'procurement', 'Strategic procurement solutions to source quality materials and equipment.', 'Our procurement team specializes in sourcing high-quality materials, equipment, and supplies for construction, mining, and industrial projects. We leverage our extensive supplier network to deliver cost-effective solutions.', 'ShoppingCart', 4, TRUE),
('f1g2h3i4-j5j6-4890-abcd-ef1234567895', 'Consulting Services', 'consulting', 'Expert consulting for project management, feasibility studies, and strategic planning.', 'Our consulting division provides expert guidance on project feasibility, risk assessment, regulatory compliance, and strategic planning. We help clients navigate complex projects with confidence.', 'Lightbulb', 5, TRUE),
('g1h2i3j4-k5k6-4890-abcd-ef1234567896', 'Equipment Rental', 'equipment-rental', 'Quality construction and mining equipment available for short and long-term rental.', 'Access our extensive inventory of well-maintained construction and mining equipment. From excavators to generators, we offer flexible rental terms to meet your project requirements.', 'Cog', 6, TRUE);

-- ============================================
-- SAMPLE PROJECTS
-- ============================================
INSERT INTO projects (id, title, slug, description, category, client, location, status, is_featured, is_published) VALUES
('h1i2j3k4-l5l6-4890-abcd-ef1234567897', 'Kolwezi Mining Facility Expansion', 'kolwezi-mining-facility', 'Major expansion project for a copper mining facility including new processing infrastructure.', 'mining', 'Gécamines', 'Kolwezi, Lualaba', 'completed', TRUE, TRUE),
('i1j2k3l4-m5m6-4890-abcd-ef1234567898', 'Commercial Complex Development', 'commercial-complex', 'Multi-story commercial building with modern amenities and sustainable design.', 'construction', 'Private Client', 'Lubumbashi', 'ongoing', TRUE, TRUE),
('j1k2l3m4-n5n6-4890-abcd-ef1234567899', 'Mining Equipment Logistics', 'mining-equipment-logistics', 'Large-scale logistics operation for transporting heavy mining equipment.', 'logistics', 'Mining Corporation', 'Kolwezi - Lubumbashi Route', 'completed', FALSE, TRUE);

-- ============================================
-- SAMPLE NEWS
-- ============================================
INSERT INTO news (id, title, slug, excerpt, content, category, author_name, is_published, published_at) VALUES
('k1l2m3n4-o5o6-4890-abcd-ef1234567900', 'KMS SARL Expands Operations in Lualaba Province', 'kms-expands-lualaba', 'KMS SARL announces significant expansion of services in the Lualaba Province, strengthening our commitment to regional development.', 'KMS SARL is pleased to announce a major expansion of our operations in Lualaba Province. This expansion includes new equipment acquisitions, additional workforce, and enhanced service capabilities to better serve our growing client base in the mining sector.', 'company', 'KMS Communications', TRUE, NOW()),
('l1m2n3o4-p5p6-4890-abcd-ef1234567901', 'New Partnership with International Mining Corporation', 'international-partnership', 'Strategic partnership established to enhance mining support services across the DRC.', 'KMS SARL has entered into a strategic partnership with a leading international mining corporation to provide enhanced support services across multiple mining sites in the Democratic Republic of Congo.', 'company', 'KMS Communications', TRUE, NOW());

-- ============================================
-- SAMPLE JOB POSTINGS
-- ============================================
INSERT INTO job_postings (id, title, slug, department, location, employment_type, experience_level, description, requirements, responsibilities, is_active) VALUES
('m1n2o3p4-q5q6-4890-abcd-ef1234567902', 'Project Manager - Construction', 'project-manager-construction', 'Construction', 'Kolwezi, DRC', 'full-time', 'senior', 'We are seeking an experienced Project Manager to oversee our construction projects in the Kolwezi region.', '["Bachelor''s degree in Civil Engineering or Construction Management", "Minimum 5 years of project management experience", "Proven track record of delivering projects on time and within budget"]', '["Plan and execute construction projects", "Manage budgets and timelines", "Coordinate with stakeholders", "Ensure compliance with safety standards"]', TRUE),
('n1o2p3q4-r5r6-4890-abcd-ef1234567903', 'Heavy Equipment Operator', 'heavy-equipment-operator', 'Operations', 'Kolwezi, DRC', 'full-time', 'mid', 'Experienced heavy equipment operators needed for mining and construction projects.', '["Valid heavy equipment operator license", "Minimum 3 years of experience with excavators and bulldozers", "Knowledge of safety protocols"]', '["Operate heavy machinery safely and efficiently", "Perform routine maintenance checks", "Report equipment issues promptly"]', TRUE),
('o1p2q3r4-s5s6-4890-abcd-ef1234567904', 'Logistics Coordinator', 'logistics-coordinator', 'Logistics', 'Lubumbashi, DRC', 'full-time', 'mid', 'Coordinate transportation and supply chain operations for our logistics division.', '["Bachelor''s degree in Logistics or related field", "3+ years of logistics experience", "Knowledge of DRC transportation regulations"]', '["Manage transportation schedules", "Coordinate with suppliers", "Track shipments", "Optimize delivery routes"]', TRUE);

-- ============================================
-- SITE SETTINGS
-- ============================================
INSERT INTO site_settings (id, setting_key, setting_value, setting_type, description) VALUES
('p1q2r3s4-t5t6-4890-abcd-ef1234567905', 'company_name', 'KMS SARL', 'text', 'Company display name'),
('q1r2s3t4-u5u6-4890-abcd-ef1234567906', 'company_email', 'info@kmssarl.org', 'text', 'Primary contact email'),
('r1s2t3u4-v5v6-4890-abcd-ef1234567907', 'company_phone', '+243 XXX XXX XXX', 'text', 'Primary contact phone'),
('s1t2u3v4-w5w6-4890-abcd-ef1234567908', 'company_address', 'Kolwezi, Lualaba Province, Democratic Republic of Congo', 'text', 'Company headquarters address'),
('t1u2v3w4-x5x6-4890-abcd-ef1234567909', 'hero_title', 'Building Tomorrow''s Congo Today', 'text', 'Homepage hero section title'),
('u1v2w3x4-y5y6-4890-abcd-ef1234567910', 'hero_subtitle', 'Premier construction, mining support, and logistics services in the Democratic Republic of Congo', 'text', 'Homepage hero section subtitle');