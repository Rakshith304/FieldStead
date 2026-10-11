import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, CirclePlus, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import api, { errorText } from '../api';
import EquipmentVisual from '../components/EquipmentVisual.jsx';

const pageSize = 20;
const categories = ['Crop Care', 'Fertilizing', 'Field Maintenance', 'Harvesting', 'Irrigation', 'Land Preparation', 'Planting', 'Post-harvest', 'Sowing', 'Tillage', 'Transport', 'Tractor'];
const emptyForm = { name: '', category: '', dailyRate: '', quantity: 1, description: '', uses: '', imageUrl: '' };

export default function Equipment({ user }) {
  const [catalog, setCatalog] = useState({ content: [], totalElements: 0, totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api.get('/equipment', { params: { page, size: pageSize, search, category }, signal: controller.signal })
      .then(({ data }) => setCatalog(data))
      .catch((error) => { if (error.name !== 'CanceledError') { setMessage(errorText(error)); setIsError(true); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, search, category, refresh]);

  function notify(text, error = false) {
    setMessage(text);
    setIsError(error);
  }

  async function addEquipment(event) {
    event.preventDefault();
    try {
      await api.post('/equipment', { ...form, dailyRate: Number(form.dailyRate), quantity: Number(form.quantity) });
      setForm(emptyForm);
      notify('Equipment added to the catalog.');
      setPage(0);
      setRefresh((value) => value + 1);
    } catch (error) {
      notify(errorText(error), true);
    }
  }

  const firstItem = catalog.totalElements === 0 ? 0 : page * pageSize + 1;
  const lastItem = Math.min((page + 1) * pageSize, catalog.totalElements);

  return (
    <div className="catalog-page">
      <section className="catalog-intro">
        <div>
          <span className="eyebrow"><span className="eyebrow-mark" /> FIELD INVENTORY / INDIA</span>
          <h1>Make room for<br /><em>what's next.</em></h1>
          <p>Reliable equipment for the jobs that shape a season. Browse, compare, and book by the day.</p>
        </div>
        <div className="catalog-stat"><span className="stat-number">{catalog.totalElements.toString().padStart(2, '0')}</span><span>machines ready<br />for the next season</span></div>
        <div className="catalog-photo" role="img" aria-label="Sunlit agricultural fields"><span>GROW TOGETHER</span></div>
      </section>
      <section className="catalog-promises" aria-label="Fieldstead rental benefits">
        <div><strong>{catalog.totalElements}</strong><span>equipment listings</span></div>
        <div><strong>01</strong><span>simple daily pricing</span></div>
        <div><strong>02</strong><span>requests reviewed by a real team</span></div>
        <div><strong>03</strong><span>payment only after approval</span></div>
      </section>

      <section className="catalog-toolbar" aria-label="Filter equipment">
        <label className="search-field"><Search size={18} /><input type="search" value={search} maxLength="120" onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search by equipment name" aria-label="Search by equipment name" /></label>
        <label className="category-field"><SlidersHorizontal size={17} /><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }} aria-label="Filter by category"><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <span className="page-size-note">20 per page</span>
      </section>

      {isAdmin && <form className="admin-add" onSubmit={addEquipment}>
        <div className="admin-add-heading"><span className="admin-add-icon"><CirclePlus size={18} /></span><div><strong>Add equipment</strong><small>New listings appear in the public catalog.</small></div></div>
        <div className="admin-add-fields">
          <input aria-label="Equipment name" placeholder="Equipment name" maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input aria-label="Category" placeholder="Category" maxLength="80" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
          <input aria-label="Daily rate" type="number" min="0.01" step="0.01" placeholder="Rate per day" value={form.dailyRate} onChange={(event) => setForm({ ...form, dailyRate: event.target.value })} required />
          <input aria-label="Quantity" type="number" min="0" step="1" placeholder="Units" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required />
          <input aria-label="Equipment image URL" type="url" maxLength="500" placeholder="Photo URL (https://...)" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <textarea aria-label="Description" placeholder="Short description" maxLength="2000" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          <textarea aria-label="Uses" placeholder="What is it used for?" maxLength="2000" value={form.uses} onChange={(event) => setForm({ ...form, uses: event.target.value })} required />
        </div>
        <button className="button button-primary" type="submit">Add listing <ArrowUpRight size={16} /></button>
      </form>}

      {message && <p className={isError ? 'inline-message error-message' : 'inline-message success-message'} role="status">{message}</p>}
      <div className="catalog-results-heading"><h2>Available equipment</h2><span>{loading ? 'Updating catalog...' : `${firstItem}-${lastItem} of ${catalog.totalElements} results`}</span></div>

      {loading && <div className="loading-line"><span /> Loading equipment</div>}
      {!loading && catalog.content.length === 0 && <div className="empty-state"><Search size={25} /><h3>No equipment found</h3><p>Try a broader search or clear the category filter.</p><button className="button button-quiet" type="button" onClick={() => { setSearch(''); setCategory(''); }}>Clear filters</button></div>}
      {!loading && catalog.content.length > 0 && <div className="equipment-grid">
        {catalog.content.map((equipment, index) => <article className="equipment-card" key={equipment.id} style={{ '--card-index': index }}>
          <Link className="equipment-image-link" to={`/equipment/${equipment.id}`} aria-label={`View ${equipment.name}`}><EquipmentVisual equipment={equipment} /></Link>
          <div className="equipment-card-body">
            <div className="equipment-card-meta"><span className="category-label">{equipment.category}</span><span className={equipment.quantity > 0 ? 'availability available' : 'availability unavailable'}>{equipment.quantity > 0 ? 'Available' : 'Booked'}</span></div>
            <h3><Link to={`/equipment/${equipment.id}`}>{equipment.name}</Link></h3>
            <p>{equipment.description || 'A dependable farm essential, ready when your next field job begins.'}</p>
            <div className="equipment-card-foot"><span className="daily-rate"><strong>Rs. {Number(equipment.dailyRate).toLocaleString('en-IN')}</strong><small> / day</small></span><Link className="detail-link" to={`/equipment/${equipment.id}`} aria-label={`Details for ${equipment.name}`}><ArrowUpRight size={18} /></Link></div>
          </div>
        </article>)}
      </div>}

      {!loading && catalog.totalPages > 1 && <nav className="pagination" aria-label="Catalog pages">
        <button className="button button-quiet" type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}><ChevronLeft size={17} /> Previous</button>
        <span>Page <strong>{page + 1}</strong> of {catalog.totalPages}</span>
        <button className="button button-quiet" type="button" onClick={() => setPage((value) => Math.min(catalog.totalPages - 1, value + 1))} disabled={page + 1 >= catalog.totalPages}>Next <ChevronRight size={17} /></button>
      </nav>}

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <span className="eyebrow"><span className="eyebrow-mark" /> WE’RE HERE TO HELP</span>
          <h2>Let’s get your next<br /><em>field job moving.</em></h2>
          <p>Need help choosing equipment or planning your dates? Reach out and our demo farm team will point you in the right direction.</p>
          <a className="button button-primary" href="mailto:hello@fieldstead.example?subject=Fieldstead%20equipment%20enquiry">Contact the team <ArrowUpRight size={16} /></a>
          <span className="contact-demo-note">Sample contact details shown for this demo.</span>
        </div>
        <a className="location-card" href="https://www.google.com/maps/search/?api=1&query=Demo+Farm+Bengaluru+India" target="_blank" rel="noreferrer" aria-label="Open demo farm location in Google Maps">
          <div className="location-map"><span className="map-grid" /><span className="map-pin"><MapPin size={21} /></span><span className="map-label">FIELDSTEAD / INDIA</span></div>
          <div className="location-caption"><span><strong>Our demo location</strong><small>Bengaluru, India</small></span><ArrowUpRight size={18} /></div>
        </a>
      </section>
    </div>
  );
}
