INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Power Tiller 9HP', 'Tillage', 950.00, 3, b'0', 'Compact, fuel-efficient tiller for preparing small and medium plots.', 'Loosen soil, mix compost, and prepare seedbeds for vegetable and paddy fields.', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0e6fca?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Power Tiller 9HP');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Mini Tractor 24HP', 'Tractor', 1400.00, 2, b'0', 'Nimble compact tractor suited to narrow access lanes and smaller holdings.', 'Tow light trailers, run small implements, and maintain orchard or greenhouse rows.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Mini Tractor 24HP');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Laser Land Leveler', 'Land Preparation', 2200.00, 1, b'0', 'Precision leveling attachment that helps create a consistent field grade.', 'Level fields before sowing to improve irrigation distribution and reduce water pooling.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Laser Land Leveler');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Disc Harrow 8 Plate', 'Tillage', 1100.00, 2, b'0', 'Heavy-duty disc implement for breaking clods and working crop residue into soil.', 'Prepare seedbeds after ploughing and incorporate stubble between crop cycles.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Disc Harrow 8 Plate');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Mouldboard Plough', 'Tillage', 850.00, 3, b'0', 'Reversible plough for turning compacted soil and burying surface residue.', 'Primary tillage for fallow fields and fields needing deeper soil turning.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Mouldboard Plough');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Paddy Transplanter 8 Row', 'Planting', 3200.00, 1, b'0', 'Walk-behind transplanter designed for uniform planting in prepared paddy fields.', 'Set young rice seedlings at consistent spacing while reducing manual transplanting time.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Paddy Transplanter 8 Row');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Precision Planter 4 Row', 'Planting', 1750.00, 2, b'0', 'Row planter with metering units for consistent seed placement.', 'Plant maize, pulses, and other row crops at regular depth and spacing.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Precision Planter 4 Row');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Zero Till Seed Drill', 'Sowing', 1600.00, 2, b'0', 'Direct-seeding drill that places seed with minimal soil disturbance.', 'Sow into retained crop residue to reduce field preparation passes and conserve moisture.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Zero Till Seed Drill');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Fertilizer Broadcaster', 'Fertilizing', 450.00, 4, b'0', 'PTO-driven spreader for even distribution of granular farm inputs.', 'Broadcast fertilizer or cover-crop seed across open fields.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Fertilizer Broadcaster');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Boom Sprayer 400L', 'Crop Care', 900.00, 2, b'0', 'Tractor-mounted sprayer with a wide boom for consistent field coverage.', 'Apply crop-protection products or foliar feeds according to product labels.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Boom Sprayer 400L');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Orchard Air Blast Sprayer', 'Crop Care', 1250.00, 1, b'0', 'Compact air-assisted sprayer configured for tree-crop canopies.', 'Treat fruit-tree foliage and canopy interiors; use only with trained operators and PPE.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Orchard Air Blast Sprayer');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Flail Mower 5 ft', 'Field Maintenance', 1000.00, 2, b'0', 'Rear-mounted mower that chops grass and light crop residue.', 'Maintain field margins, orchard alleys, and overgrown ground.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Flail Mower 5 ft');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Rotary Slasher', 'Field Maintenance', 800.00, 3, b'0', 'Rugged rotary cutter for rough grass and light brush.', 'Clear weeds and maintain farm tracks or uncropped plots.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Rotary Slasher');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Hay Baler Round', 'Harvesting', 2800.00, 1, b'0', 'Round baler for collecting and compacting dry forage.', 'Form manageable hay bales for storage and livestock feed.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Hay Baler Round');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Mini Combine Harvester', 'Harvesting', 4800.00, 1, b'0', 'Compact combine for harvesting grain on smaller fields.', 'Cut, thresh, and collect mature grain crops in one field pass.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Mini Combine Harvester');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Maize Sheller', 'Post-harvest', 650.00, 2, b'0', 'Mechanical sheller that separates kernels from dried maize cobs.', 'Prepare harvested maize for drying, storage, or sale.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Maize Sheller');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Straw Chopper', 'Post-harvest', 780.00, 2, b'0', 'Residue chopper that cuts straw into shorter, easier-to-handle lengths.', 'Manage post-harvest residue for composting, mulch, or livestock bedding.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Straw Chopper');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Farm Trailer 2 Ton', 'Transport', 600.00, 3, b'0', 'Two-tonne utility trailer with a reinforced bed for farm transport.', 'Move produce, seed, tools, and harvested materials around the farm.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Farm Trailer 2 Ton');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Post Hole Digger', 'Land Preparation', 550.00, 2, b'0', 'Tractor-mounted auger for making consistent holes in firm ground.', 'Install fence posts, orchard supports, and small farm structures.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Post Hole Digger');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Water Pump 3 inch', 'Irrigation', 400.00, 4, b'0', 'Portable high-flow pump for moving clean water between farm sources and fields.', 'Transfer irrigation water or drain shallow standing water; follow safe fuel handling.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Water Pump 3 inch');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Drip Irrigation Filter Set', 'Irrigation', 350.00, 5, b'0', 'Filter and pressure-control kit for a small drip irrigation line.', 'Protect drip emitters from sediment in vegetable and orchard irrigation systems.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Drip Irrigation Filter Set');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Post-harvest Grain Cleaner', 'Post-harvest', 900.00, 1, b'0', 'Screen-based cleaner for separating light debris from harvested grain.', 'Clean dry grain before bagging, storage, or further processing.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Post-harvest Grain Cleaner');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Soil Compactor Roller', 'Land Preparation', 700.00, 2, b'0', 'Towable roller for firming prepared soil and seedbeds.', 'Consolidate seedbeds after sowing small seeds or prepare level paths.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Soil Compactor Roller');
INSERT INTO equipment (name, category, daily_rate, quantity, archived, description, equipment_uses, image_url)
SELECT 'Coconut Dehusker', 'Post-harvest', 500.00, 2, b'0', 'Manual-assisted dehusking machine for small-batch coconut processing.', 'Remove coconut husks after harvest using the provided safety guard.', NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Coconut Dehusker');