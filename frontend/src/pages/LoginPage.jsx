import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export function LoginPage() {
  const { admin, login } = useAuth(); const [form, setForm] = useState({ email:'', password:'' }); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  if (admin) return <Navigate to="/" replace/>;
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await login(form); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <div className="login-page"><section className="login-showcase"><div className="brand brand--light"><span className="brand-mark"><Sparkles/></span><strong>XFia Studio</strong></div><div><span className="eyebrow">Da oportunidade ao site</span><h1>Seu estúdio de criação, em um só lugar.</h1><p>Organize empresas, avalie oportunidades e transforme boas prospecções em projetos reais.</p></div><small>Ambiente administrativo privado</small></section><section className="login-panel"><form className="login-card" onSubmit={submit}><div className="login-icon"><LockKeyhole/></div><span className="eyebrow">Bem-vindo de volta</span><h2>Acesse o painel</h2><p>Use as credenciais administrativas configuradas no servidor.</p>{error && <div className="form-error">{error}</div>}<label>E-mail<input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="admin@empresa.com"/></label><label>Senha<input type="password" autoComplete="current-password" minLength="8" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></label><button className="button button--primary button--wide" disabled={busy}>{busy ? <><span className="spinner"/>Entrando...</> : <>Entrar <ArrowRight size={18}/></>}</button></form></section></div>;
}
