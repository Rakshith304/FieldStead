INSERT INTO equipment (name, category, daily_rate, quantity, archived)
SELECT 'Tractor 45HP', 'Tractor', 1800.00, 2, b'0'
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Tractor 45HP');

INSERT INTO equipment (name, category, daily_rate, quantity, archived)
SELECT 'Rotavator', 'Tillage', 700.00, 3, b'0'
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Rotavator');

INSERT INTO equipment (name, category, daily_rate, quantity, archived)
SELECT 'Combine Harvester', 'Harvesting', 6500.00, 1, b'0'
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Combine Harvester');

INSERT INTO equipment (name, category, daily_rate, quantity, archived)
SELECT 'Seed Drill', 'Sowing', 500.00, 4, b'0'
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = 'Seed Drill');

UPDATE equipment SET description = 'Versatile 45 HP tractor for general field work and medium-duty implements.', equipment_uses = 'Tow implements, haul farm loads, and prepare fields for routine seasonal operations.' WHERE name = 'Tractor 45HP';
UPDATE equipment SET description = 'PTO-driven rotary tiller for breaking and mixing soil in prepared fields.', equipment_uses = 'Create a fine seedbed, incorporate crop residue, and mix organic matter into soil.' WHERE name = 'Rotavator';
UPDATE equipment SET description = 'Self-propelled combine for efficient grain harvesting and collection.', equipment_uses = 'Cut, thresh, and collect mature grain crops in one pass; confirm crop and field compatibility first.' WHERE name = 'Combine Harvester';
UPDATE equipment SET description = 'Tractor-mounted seed drill for consistent depth and spacing across rows.', equipment_uses = 'Sow cereal and pulse crops evenly while reducing manual seed placement.' WHERE name = 'Seed Drill';