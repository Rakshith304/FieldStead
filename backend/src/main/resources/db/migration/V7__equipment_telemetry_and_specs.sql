-- V7: Add futuristic telemetry and engineering specs to equipment
ALTER TABLE equipment
    ADD COLUMN power_rating VARCHAR(60) NULL,
    ADD COLUMN fuel_type VARCHAR(60) NULL,
    ADD COLUMN autonomous_level VARCHAR(60) NULL,
    ADD COLUMN soil_suitability VARCHAR(200) NULL,
    ADD COLUMN gps_enabled BIT(1) NOT NULL DEFAULT 1;

UPDATE equipment SET
    power_rating = '45 HP / 33.5 kW Engine',
    fuel_type = 'Turbo Eco-Diesel',
    autonomous_level = 'RTK Level 2 Autosteer',
    soil_suitability = 'All soil types, heavy clay & loam',
    gps_enabled = 1,
    image_url = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Tractor 45HP';

UPDATE equipment SET
    power_rating = '75 HP PTO Required',
    fuel_type = 'Direct PTO Coupling',
    autonomous_level = 'Smart Depth-Sensing',
    soil_suitability = 'Wet paddy, tilled seedbeds',
    gps_enabled = 0,
    image_url = 'https://images.unsplash.com/photo-1592982537447-6f2a6a0e6fca?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Rotavator';

UPDATE equipment SET
    power_rating = '110 HP Heavy Harvester',
    fuel_type = 'High-torque EcoDiesel',
    autonomous_level = 'LiDAR Swath Navigation',
    soil_suitability = 'Dry crop fields, cereals & pulses',
    gps_enabled = 1,
    image_url = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Combine Harvester';

UPDATE equipment SET
    power_rating = '35+ HP Tractor Link',
    fuel_type = 'Ground-Wheel Synchronized',
    autonomous_level = 'Variable-Rate Metering',
    soil_suitability = 'Prepared seedbeds, moisture-retained plots',
    gps_enabled = 1,
    image_url = 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Seed Drill';

UPDATE equipment SET
    power_rating = '9 HP Honda Engine',
    fuel_type = 'Petrol / Bio-Ethanol',
    autonomous_level = 'Manual Operator Guide',
    soil_suitability = 'Horticulture, greenhouse beds, orchards',
    gps_enabled = 0
WHERE name = 'Power Tiller 9HP';

UPDATE equipment SET
    power_rating = '24 HP 4WD Compact',
    fuel_type = 'Electric-Hybrid Assist',
    autonomous_level = 'Sub-inch GPS Guidance',
    soil_suitability = 'Vineyards, narrow row crops, sandy loam',
    gps_enabled = 1,
    image_url = 'https://images.unsplash.com/photo-1606739211185-2c846d734a6d?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Mini Tractor 24HP';

UPDATE equipment SET
    power_rating = 'Dual-Laser Transmitter',
    fuel_type = '12V Mast-Powered System',
    autonomous_level = 'Hydraulic Auto-Grade Control',
    soil_suitability = 'Dry & paddy field grading',
    gps_enabled = 1,
    image_url = 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Laser Land Leveler';

UPDATE equipment SET
    power_rating = 'Wide 12m Boom Sprayer',
    fuel_type = 'Tractor 540 PTO',
    autonomous_level = 'Sectional Nozzle Shutoff',
    soil_suitability = 'Open cereal, pulse & cotton fields',
    gps_enabled = 1,
    image_url = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Boom Sprayer 400L';
