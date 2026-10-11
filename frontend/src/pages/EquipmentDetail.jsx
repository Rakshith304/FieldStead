import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleAlert, Edit3, ShieldCheck, Trash2, Wrench, X } from 'lucide-react';
import api, { errorText } from '../api';
import EquipmentVisual from '../components/EquipmentVisual.jsx';

function localToday() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function EquipmentDetail({ user }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    dailyRate: '',
    quantity: 1,
    imageUrl: '',
    description: '',
    uses: '',
  });
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api.get(`/equipment/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setEquipment(data);
        setEditForm({
          name: data.name || '',
          category: data.category || '',
          dailyRate: data.dailyRate || '',
          quantity: data.quantity ?? 1,
          imageUrl: data.imageUrl || '',
          description: data.description || '',
          uses: data.uses || '',
        });
      })
      .catch((error) => { if (error.name !== 'CanceledError') { setMessage(errorText(error)); setIsError(true); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  async function requestRental(event) {
    event.preventDefault();
    if (!user?.token) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (dates.endDate < dates.startDate) {
      setMessage('Choose an end date on or after the start date.');
      setIsError(true);
      return;
    }
    try {
      await api.post('/rentals', { equipmentId: equipment.id, ...dates });
      navigate('/rentals', { state: { notice: 'Your rental request has been sent.' } });
    } catch (error) {
      setMessage(errorText(error));
      setIsError(true);
    }
  }

  async function saveEquipment(event) {
    event.preventDefault();
    try {
      const payload = {
        ...editForm,
        dailyRate: Number(editForm.dailyRate),
        quantity: Number(editForm.quantity),
      };
      const { data } = await api.put(`/equipment/${equipment.id}`, payload);
      setEquipment(data);
      setIsEditing(false);
      setMessage('Equipment details updated successfully.');
      setIsError(false);
    } catch (error) {
      setMessage(errorText(error));
      setIsError(true);
    }
  }

  async function archiveEquipment() {
    if (!window.confirm(`Archive ${equipment.name}? It will no longer appear in the catalog.`)) return;
    try {
      await api.delete(`/equipment/${equipment.id}`);
      navigate('/catalog');
    } catch (error) {
      setMessage(errorText(error));
      setIsError(true);
    }
  }

  if (loading) return <div className="detail-loading"><span className="loading-line"><span /> Loading equipment</span></div>;
  if (!equipment) return <section className="empty-state detail-empty"><CircleAlert size={26} /><h2>Equipment unavailable</h2><p>{message || 'This listing may have been archived.'}</p><Link className="button button-quiet" to="/catalog"><ArrowLeft size={16} /> Return to catalog</Link></section>;

  const days = dates.startDate && dates.endDate && dates.endDate >= dates.startDate
    ? Math.round((new Date(`${dates.endDate}T00:00:00`) - new Date(`${dates.startDate}T00:00:00`)) / 86400000) + 1 : 0;
  const estimate = days * Number(equipment.dailyRate);

  return (
    <div className="detail-page">
      <Link className="back-link" to="/catalog"><ArrowLeft size={17} /> Back to equipment</Link>
      <div className="detail-layout">
        <div className="detail-main">
          <EquipmentVisual equipment={equipment} className="detail-visual" />
          <div className="detail-heading"><span className="category-label">{equipment.category}</span><h1>{equipment.name}</h1><p>{equipment.description || 'A dependable farm essential, ready when your next field job begins.'}</p></div>
          <section className="detail-section"><span className="eyebrow"><Wrench size={14} /> WHAT IT DOES</span><h2>Built for the work that matters.</h2><p>{equipment.uses || 'Ask the equipment owner for recommended applications and operating instructions before use.'}</p></section>
          <section className="detail-facts"><div><span>Daily rate</span><strong>Rs. {Number(equipment.dailyRate).toLocaleString('en-IN')}</strong></div><div><span>Fleet units</span><strong>{equipment.quantity}</strong></div><div><span>Availability</span><strong className={equipment.quantity > 0 ? 'fact-available' : 'fact-unavailable'}>{equipment.quantity > 0 ? 'Ready to request' : 'Currently booked'}</strong></div></section>
          <p className="safety-note"><ShieldCheck size={18} /><span>Only trained operators should use this equipment. Follow the manufacturer's instructions and use the appropriate protective equipment.</span></p>
        </div>
        <aside className="booking-panel">
          <span className="eyebrow"><CalendarDays size={14} /> {isAdmin ? 'ADMINISTRATION' : 'RENT BY THE DAY'}</span>
          <h2>{isAdmin ? (isEditing ? 'Edit equipment' : 'Manage equipment') : 'Choose your dates'}</h2>
          <p>{isAdmin ? 'Update machine listing details or remove from catalog.' : 'Submit a request and the farm team will confirm availability.'}</p>

          {!isAdmin ? (
            <form className="booking-form" onSubmit={requestRental}>
              <label className="field-label">Start date<input type="date" min={localToday()} value={dates.startDate} onChange={(event) => setDates({ ...dates, startDate: event.target.value, endDate: dates.endDate && dates.endDate < event.target.value ? '' : dates.endDate })} required /></label>
              <label className="field-label">End date<input type="date" min={dates.startDate || localToday()} value={dates.endDate} onChange={(event) => setDates({ ...dates, endDate: event.target.value })} required /></label>
              {days > 0 && <div className="estimate-row"><span>{days} {days === 1 ? 'day' : 'days'} estimated</span><strong>Rs. {estimate.toLocaleString('en-IN')}</strong></div>}
              <button className="button button-primary booking-submit" type="submit" disabled={equipment.quantity < 1}>{user?.token ? 'Request equipment' : 'Sign in to request'} <ArrowRight size={17} /></button>
            </form>
          ) : isEditing ? (
            <form className="booking-form" onSubmit={saveEquipment}>
              <label className="field-label">Name<input value={editForm.name} maxLength="120" onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></label>
              <label className="field-label">Category<input value={editForm.category} maxLength="80" onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} required /></label>
              <label className="field-label">Daily rate (Rs)<input type="number" min="0.01" step="0.01" value={editForm.dailyRate} onChange={(e) => setEditForm({ ...editForm, dailyRate: e.target.value })} required /></label>
              <label className="field-label">Fleet units<input type="number" min="0" step="1" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} required /></label>
              <label className="field-label">Photo URL<input type="url" maxLength="500" value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="https://..." /></label>
              <label className="field-label">Description<textarea maxLength="2000" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required /></label>
              <label className="field-label">Uses<textarea maxLength="2000" value={editForm.uses} onChange={(e) => setEditForm({ ...editForm, uses: e.target.value })} required /></label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="button button-primary" style={{ flex: 1 }} type="submit"><Check size={16} /> Save</button>
                <button className="button button-quiet" type="button" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="button button-primary booking-submit" type="button" onClick={() => setIsEditing(true)}><Edit3 size={16} /> Edit details</button>
              <button className="button button-quiet booking-submit" type="button" onClick={archiveEquipment}><Trash2 size={16} /> Archive listing</button>
            </div>
          )}

          {message && <p className={isError ? 'form-message error-message' : 'form-message success-message'} role="status">{message}</p>}
          {!isAdmin && <p className="booking-footnote"><Check size={14} /> No charge until your request is approved</p>}
        </aside>
      </div>
    </div>
  );
}