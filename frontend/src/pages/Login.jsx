import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, Leaf, Mail, UserRound } from 'lucide-react';
import api, { errorText } from '../api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    if (isRegister && form.password.length < 12) {
      setMessage('Use at least 12 characters for a new password.');
      setIsError(true);
      return;
    }
    setIsBusy(true);
    try {
      if (isRegister) {
        await api.post('/users/register', form);
        setIsRegister(false);
        setForm((current) => ({ ...current, password: '' }));
        setIsError(false);
        setMessage('Account created. Sign in to continue.');
      } else {
        const { data } = await api.post('/users/login', { email: form.email, password: form.password });
        onLogin(data);
        navigate(location.state?.from?.pathname || '/catalog', { replace: true });
      }
    } catch (error) {
      setMessage(errorText(error));
      setIsError(true);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-story">
        <div className="auth-story-shade" />
        <div className="auth-story-copy">
          <span className="eyebrow light-eyebrow"><Leaf size={14} /> A better way to get field-ready</span>
          <h1>Good tools.<br />Better seasons.</h1>
          <p>Find the right machine for the work ahead, then get back to growing.</p>
          <div className="story-caption"><span className="caption-rule" /> Shared equipment, local know-how</div>
        </div>
        <span className="story-index">FIELD NOTES <b>01 / 04</b></span>
      </div>
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <span className="eyebrow"><KeyRound size={14} /> FARM EQUIPMENT, ON YOUR TERMS</span>
          <h2>{isRegister ? 'Join the exchange' : 'Welcome back'}</h2>
          <p className="auth-subtitle">{isRegister ? 'Create a farmer account to request equipment.' : 'Sign in to manage your equipment and rentals.'}</p>
          <form className="auth-form" onSubmit={submit}>
            {isRegister && <label className="field-label">Full name<span className="input-wrap"><UserRound size={17} /><input name="name" autoComplete="name" maxLength="80" placeholder="e.g. Sita Devi" value={form.name} onChange={change} required /></span></label>}
            <label className="field-label">Email address<span className="input-wrap"><Mail size={17} /><input name="email" type="email" autoComplete="email" maxLength="254" placeholder="you@farm.com" value={form.email} onChange={change} required /></span></label>
            <label className="field-label">Password<span className="input-wrap"><KeyRound size={17} /><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 12 : 1} maxLength="72" placeholder={isRegister ? 'At least 12 characters' : 'Your password'} value={form.password} onChange={change} required /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            <button className="button button-primary auth-submit" type="submit" disabled={isBusy}>{isBusy ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button>
          </form>
          {message && <p className={isError ? 'form-message error-message' : 'form-message success-message'} role="status">{message}</p>}
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Fieldstead?'} <button type="button" onClick={() => { setIsRegister((value) => !value); setMessage(''); }}>{isRegister ? 'Sign in' : 'Create an account'}</button></p>
          <p className="auth-legal">By continuing, you agree to use equipment responsibly and follow all operator and safety guidance.</p>
        </div>
      </div>
    </section>
  );
}
