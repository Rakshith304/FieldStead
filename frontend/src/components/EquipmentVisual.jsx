import { Sprout, Tractor, Wheat, Wrench } from 'lucide-react';

export default function EquipmentVisual({ equipment, className = '' }) {
  const category = equipment.category?.toLowerCase() || '';
  const MachineIcon = category.includes('harvest') || category.includes('post-harvest') ? Wheat
    : category.includes('plant') || category.includes('sow') || category.includes('crop') ? Sprout
      : category.includes('tillage') || category.includes('land') ? Tractor : Wrench;
  const imageUrl = equipment.imageUrl?.startsWith('https://') ? equipment.imageUrl : '';

  return (
    <div className={`machine-visual ${className}`} aria-label={`${equipment.name} product image`}>
      <span className="visual-stamp">FIELDSTEAD / VERIFIED</span>
      <MachineIcon className="machine-icon" strokeWidth={1.15} aria-hidden="true" />
      {imageUrl && <img src={imageUrl} alt={equipment.name} loading="lazy" onError={(event) => { event.currentTarget.dataset.failed = 'true'; }} />}
      <span className="visual-sun" />
    </div>
  );
}