-- KMS SARL Additional Seed Data for PostgreSQL
-- Run this after the main seed data

-- ============================================
-- ADDITIONAL SERVICES WITH IMAGES
-- ============================================
UPDATE services SET 
  featured_image = '/services/construction.jpg' 
WHERE slug = 'construction';

UPDATE services SET 
  featured_image = '/services/mining.jpg' 
WHERE slug = 'mining-support';

UPDATE services SET 
  featured_image = '/services/logistics.jpg' 
WHERE slug = 'logistics';

UPDATE services SET 
  featured_image = '/services/procurement.jpg' 
WHERE slug = 'procurement';

UPDATE services SET 
  featured_image = '/services/consulting.jpg' 
WHERE slug = 'consulting';

UPDATE services SET 
  featured_image = '/services/equipment.jpg' 
WHERE slug = 'equipment-rental';

-- ============================================
-- PROJECT UPDATES WITH IMAGES
-- ============================================
UPDATE projects SET 
  featured_image = '/projects/mining-facility.jpg',
  full_description = 'This major expansion project for the copper mining facility involved upgrading processing infrastructure to increase output capacity by 30%. Our team managed all aspects of the construction, from site preparation to commissioning of new equipment. The project was completed on schedule and under budget, demonstrating our commitment to excellence in mining infrastructure development.'
WHERE slug = 'kolwezi-mining-facility';

UPDATE projects SET 
  featured_image = '/projects/commercial-complex.jpg',
  full_description = 'Our commercial complex development in Lubumbashi represents modern architectural design combined with sustainable building practices. The facility features energy-efficient systems, modern amenities, and flexible office spaces designed to meet the needs of businesses in the region. The project showcases our expertise in commercial construction and our commitment to quality.'
WHERE slug = 'commercial-complex';

UPDATE projects SET 
  featured_image = '/projects/logistics-operation.jpg',
  full_description = 'This large-scale logistics operation involved coordinating the transportation of heavy mining equipment across challenging terrain in the DRC. Our logistics team planned and executed a complex multi-modal transport strategy involving specialized vehicles, route planning, and coordination with local authorities. The successful completion of this project demonstrates our capability to handle demanding logistics challenges.'
WHERE slug = 'mining-equipment-logistics';

-- ============================================
-- CONTACT FORM FIELDS SETUP
-- ============================================
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('contact_form_fields', '[{"name":"name","label":"Full Name","type":"text","required":true},{"name":"email","label":"Email Address","type":"email","required":true},{"name":"phone","label":"Phone Number","type":"tel","required":false},{"name":"company","label":"Company","type":"text","required":false},{"name":"subject","label":"Subject","type":"text","required":true},{"name":"message","label":"Message","type":"textarea","required":true}]', 'json', 'Contact form field configuration');

-- ============================================
-- SOCIAL MEDIA LINKS
-- ============================================
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('social_links', '[{"platform":"facebook","url":"https://facebook.com/kmssarl","icon":"Facebook"},{"platform":"twitter","url":"https://twitter.com/kmssarl","icon":"Twitter"},{"platform":"linkedin","url":"https://linkedin.com/company/kmssarl","icon":"Linkedin"}]', 'json', 'Social media links');

-- ============================================
-- COMPANY INFORMATION
-- ============================================
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('company_mission', 'To deliver exceptional construction, mining support, and logistics services that contribute to the sustainable development of the Democratic Republic of Congo.', 'text', 'Company mission statement'),
('company_vision', 'To be the premier service provider in the DRC construction and mining sectors, recognized for quality, reliability, and innovation.', 'text', 'Company vision statement'),
('company_values', '["Integrity", "Excellence", "Safety", "Sustainability", "Community"]', 'json', 'Company core values');