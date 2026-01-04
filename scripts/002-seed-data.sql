-- KMS SARL Seed Data for MySQL
-- Run this after creating tables

-- ============================================
-- CREATE ADMIN USER (password: admin123 - CHANGE THIS!)
-- Password hash generated with bcrypt for 'admin123'
-- ============================================
INSERT INTO admin_users (id, email, password_hash, full_name, role) VALUES
(UUID(), 'admin@kmssarl.org', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrqd8aA/jphcNpYJMXJqj3UmLvH4R.W', 'KMS Administrator', 'super_admin');

-- ============================================
-- SERVICES DATA
-- ============================================
INSERT INTO services (id, title, slug, short_description, full_description, icon, sort_order, is_active) VALUES
(UUID(), 'Construction & Civil Works', 'construction', 'Comprehensive construction services including residential, commercial, and industrial projects.', 'KMS SARL delivers exceptional construction and civil engineering services throughout the Democratic Republic of Congo. From residential developments to large-scale industrial facilities, our experienced team ensures quality craftsmanship, timely delivery, and strict adherence to safety standards.', 'Building2', 1, TRUE),
(UUID(), 'Mining Support Services', 'mining-support', 'Specialized support services for mining operations including equipment and technical expertise.', 'We provide comprehensive mining support services tailored to the unique challenges of the Congolese mining sector. Our services include equipment supply, maintenance, technical consulting, and workforce solutions designed to optimize your mining operations.', 'Pickaxe', 2, TRUE),
(UUID(), 'Logistics & Transportation', 'logistics', 'Efficient logistics solutions for cargo transportation and supply chain management.', 'KMS SARL offers reliable logistics and transportation services across the DRC. Our fleet and logistics expertise ensure safe, timely delivery of goods, equipment, and materials to even the most remote locations.', 'Truck', 3, TRUE),
(UUID(), 'Procurement Services', 'procurement', 'Strategic procurement solutions to source quality materials and equipment.', 'Our procurement team specializes in sourcing high-quality materials, equipment, and supplies for construction, mining, and industrial projects. We leverage our extensive supplier network to deliver cost-effective solutions.', 'ShoppingCart', 4, TRUE),
(UUID(), 'Consulting Services', 'consulting', 'Expert consulting for project management, feasibility studies, and strategic planning.', 'Our consulting division provides expert guidance on project feasibility, risk assessment, regulatory compliance, and strategic planning. We help clients navigate complex projects with confidence.', 'Lightbulb', 5, TRUE),
(UUID(), 'Equipment Rental', 'equipment-rental', 'Quality construction and mining equipment available for short and long-term rental.', 'Access our extensive inventory of well-maintained construction and mining equipment. From excavators to generators, we offer flexible rental terms to meet your project requirements.', 'Cog', 6, TRUE);

-- ============================================
-- SAMPLE PROJECTS
-- ============================================
INSERT INTO projects (id, title, slug, description, category, client, location, status, is_featured, is_published) VALUES
(UUID(), 'Kolwezi Mining Facility Expansion', 'kolwezi-mining-facility', 'Major expansion project for a copper mining facility including new processing infrastructure.', 'mining', 'Gécamines', 'Kolwezi, Lualaba', 'completed', TRUE, TRUE),
(UUID(), 'Commercial Complex Development', 'commercial-complex', 'Multi-story commercial building with modern amenities and sustainable design.', 'construction', 'Private Client', 'Lubumbashi', 'ongoing', TRUE, TRUE),
(UUID(), 'Mining Equipment Logistics', 'mining-equipment-logistics', 'Large-scale logistics operation for transporting heavy mining equipment.', 'logistics', 'Mining Corporation', 'Kolwezi - Lubumbashi Route', 'completed', FALSE, TRUE);

-- ============================================
-- SAMPLE NEWS
-- ============================================
INSERT INTO news (id, title, slug, excerpt, content, category, author_name, is_published, published_at) VALUES
(UUID(), 'KMS SARL Expands Operations in Lualaba Province', 'kms-expands-lualaba', 'KMS SARL announces significant expansion of services in the Lualaba Province, strengthening our commitment to regional development.', 'KMS SARL is pleased to announce a major expansion of our operations in Lualaba Province. This expansion includes new equipment acquisitions, additional workforce, and enhanced service capabilities to better serve our growing client base in the mining sector.', 'company', 'KMS Communications', TRUE, NOW()),
(UUID(), 'New Partnership with International Mining Corporation', 'international-partnership', 'Strategic partnership established to enhance mining support services across the DRC.', 'KMS SARL has entered into a strategic partnership with a leading international mining corporation to provide enhanced support services across multiple mining sites in the Democratic Republic of Congo.', 'company', 'KMS Communications', TRUE, NOW());

-- ============================================
-- SAMPLE JOB POSTINGS
-- ============================================
INSERT INTO job_postings (id, title, slug, department, location, employment_type, experience_level, description, is_active) VALUES
(UUID(), 'Project Manager - Construction', 'project-manager-construction', 'Construction', 'Kolwezi, DRC', 'full-time', 'senior', 'We are seeking an experienced Project Manager to oversee our construction projects in the Kolwezi region.', TRUE),
(UUID(), 'Heavy Equipment Operator', 'heavy-equipment-operator', 'Operations', 'Kolwezi, DRC', 'full-time', 'mid', 'Experienced heavy equipment operators needed for mining and construction projects.', TRUE),
(UUID(), 'Logistics Coordinator', 'logistics-coordinator', 'Logistics', 'Lubumbashi, DRC', 'full-time', 'mid', 'Coordinate transportation and supply chain operations for our logistics division.', TRUE);

-- ============================================
-- SITE SETTINGS
-- ============================================
INSERT INTO site_settings (id, setting_key, setting_value, setting_type, description) VALUES
(UUID(), 'company_name', 'KMS SARL', 'text', 'Company display name'),
(UUID(), 'company_email', 'info@kmssarl.org', 'text', 'Primary contact email'),
(UUID(), 'company_phone', '+243 XXX XXX XXX', 'text', 'Primary contact phone'),
(UUID(), 'company_address', 'Kolwezi, Lualaba Province, Democratic Republic of Congo', 'text', 'Company headquarters address'),
(UUID(), 'hero_title', 'Building Tomorrow''s Congo Today', 'text', 'Homepage hero section title'),
(UUID(), 'hero_subtitle', 'Premier construction, mining support, and logistics services in the Democratic Republic of Congo', 'text', 'Homepage hero section subtitle');
