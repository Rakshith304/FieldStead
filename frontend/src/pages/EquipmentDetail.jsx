import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleAlert, ShieldCheck, Wrench } from 'lucide-react';
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
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api.get(`/equipment/${id}`, { signal: controller.signal })
      .then(({ data }) => setEquipment(data))
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
          <span className="eyebrow"><CalendarDays size={14} /> RENT BY THE DAY</span>
          <h2>Choose your dates</h2>
          <p>Submit a request and the farm team will confirm availability.</p>
          {!isAdmin ? <form className="booking-form" onSubmit={requestRental}>
            <label className="field-label">Start date<input type="date" min={localToday()} value={dates.startDate} onChange={(event) => setDates({ ...dates, startDate: event.target.value, endDate: dates.endDate && dates.endDate < event.target.value ? '' : dates.endDate })} required /></label>
            <label className="field-label">End date<input type="date" min={dates.startDate || localToday()} value={dates.endDate} onChange={(event) => setDates({ ...dates, endDate: event.target.value })} required /></label>
            {days > 0 && <div className="estimate-row"><span>{days} {days === 1 ? 'day' : 'days'} estimated</span><strong>Rs. {estimate.toLocaleString('en-IN')}</strong></div>}
            <button className="button button-primary booking-submit" type="submit" disabled={equipment.quantity < 1}>{user?.token ? 'Request equipment' : 'Sign in to request'} <ArrowRight size={17} /></button>
          </form> : <button className="button button-quiet booking-submit" type="button" onClick={archiveEquipment}>Archive listing</button>}
          {message && <p className={isError ? 'form-message error-message' : 'form-message success-message'} role="status">{message}</p>}
          <p className="booking-footnote"><Check size={14} /> No charge until your request is approved</p>
        </aside>
      </div>
    </div>
  );
}