import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Check, CircleAlert, Clock3, CreditCard } from 'lucide-react';
import api, { errorText } from '../api';

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let script = document.querySelector('script[data-razorpay]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.dataset.razorpay = 'true';
      script.async = true;
    }
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', () => {
      script.remove();
      reject(new Error('Secure checkout could not load. Check your connection and try again.'));
    }, { once: true });
    if (!script.isConnected) document.body.appendChild(script);
  });
}

export default function Rentals({ user }) {
  const isAdmin = user.role === 'ADMIN';
  const location = useLocation();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.notice || '');
  const [isError, setIsError] = useState(false);
  const [payingRentalId, setPayingRentalId] = useState(null);

  async function loadRentals() {
    try {
      const { data } = await api.get(isAdmin ? '/rentals' : '/rentals/my');
      setRentals(data);
    } catch (error) {
      setMessage(errorText(error));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRentals(); }, []);

  async function act(id, action) {
    try {
      await api.patch(`/rentals/${id}/${action}`);
      setMessage('Rental status updated.');
      setIsError(false);
      await loadRentals();
    } catch (error) {
      setMessage(errorText(error));
      setIsError(true);
    }
  }

  async function startCheckout(rental) {
    setPayingRentalId(rental.id);
    setMessage('');
    try {
      await loadRazorpay();
      const { data: order } = await api.post(`/payments/rentals/${rental.id}/order`);
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Fieldstead',
        description: `${order.description} rental`,
        order_id: order.orderId,
        prefill: { name: order.customerName, email: order.customerEmail },
        theme: { color: '#244b36' },
        handler: async (response) => {
          try {
            await api.post(`/payments/rentals/${rental.id}/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setMessage('Payment received and verified. Your rental is confirmed.');
            setIsError(false);
            await loadRentals();
          } catch (error) {
            setMessage(errorText(error));
            setIsError(true);
          } finally {
            setPayingRentalId(null);
          }
        },
        modal: { ondismiss: () => setPayingRentalId(null) },
      });
      checkout.on('payment.failed', (event) => {
        setMessage(event.error?.description || 'Payment could not be completed. Please try again.');
        setIsError(true);
        setPayingRentalId(null);
      });
      checkout.open();
    } catch (error) {
      setMessage(error.response ? errorText(error) : error.message);
      setIsError(true);
      setPayingRentalId(null);
    }
  }

  return (
    <section className="rentals-page">
      <div className="page-heading"><div><span className="eyebrow"><span className="eyebrow-mark" /> RENTAL DESK</span><h1>{isAdmin ? 'Requests in motion.' : 'Your field plans.'}</h1><p>{isAdmin ? 'Review bookings and keep equipment moving.' : 'Track each request from first ask to return.'}</p></div><Link className="text-action" to="/catalog">Browse equipment <ArrowUpRight size={17} /></Link></div>
      {message && <p className={isError ? 'inline-message error-message' : 'inline-message success-message'} role="status">{message}</p>}
      {loading && <div className="loading-line"><span /> Loading rental requests</div>}
      {!loading && rentals.length === 0 && <div className="empty-state"><Clock3 size={25} /><h2>No requests yet</h2><p>When a rental is requested, it will show up here.</p><Link className="button button-primary" to="/catalog">Explore equipment <ArrowUpRight size={16} /></Link></div>}
      {!loading && rentals.length > 0 && <div className="rental-list">
        {rentals.map((rental) => <article className="rental-row" key={rental.id}>
          <div className="rental-date-block"><span>REQUEST</span><strong>#{String(rental.id).padStart(4, '0')}</strong></div>
          <div className="rental-main"><div className="rental-title-row"><h2>{rental.equipment.name}</h2><span className={`status-pill status-${rental.status.toLowerCase()}`}>{rental.status}</span>{rental.status === 'APPROVED' && <span className={`payment-pill payment-${rental.paymentStatus.toLowerCase()}`}>{rental.paymentStatus === 'PAID' ? 'PAID' : 'PAYMENT DUE'}</span>}</div><p>{rental.startDate} to {rental.endDate}{isAdmin && <span> <i>/</i> Requested by {rental.farmer.name}</span>}</p><div className="rental-total">Rs. {Number(rental.totalAmount).toLocaleString('en-IN')} <span>total</span><i>/</i> Rs. {Number(rental.agreedRate).toLocaleString('en-IN')} per day</div></div>
          <div className="rental-actions">
            {!isAdmin && rental.status === 'PENDING' && <button className="button button-quiet" onClick={() => act(rental.id, 'cancel')}>Cancel request</button>}
            {!isAdmin && rental.status === 'APPROVED' && rental.paymentStatus !== 'PAID' && <button className="button button-primary" onClick={() => startCheckout(rental)} disabled={payingRentalId !== null}><CreditCard size={15} />{payingRentalId === rental.id ? 'Opening checkout...' : 'Pay securely'}</button>}
            {isAdmin && rental.status === 'PENDING' && <><button className="button button-quiet" onClick={() => act(rental.id, 'reject')}>Decline</button><button className="button button-primary" onClick={() => act(rental.id, 'approve')}><Check size={15} /> Approve</button></>}
            {isAdmin && rental.status === 'APPROVED' && <button className="button button-primary" onClick={() => act(rental.id, 'return')}>Mark returned <Check size={15} /></button>}
          </div>
        </article>)}
      </div>}
      {!loading && isAdmin && rentals.some((rental) => rental.status === 'PENDING') && <p className="rental-safety"><CircleAlert size={16} /> Confirm dates and availability with the farmer before approving.</p>}
    </section>
  );
}
