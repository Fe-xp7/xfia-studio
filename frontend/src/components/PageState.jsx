import { AlertCircle, Inbox } from 'lucide-react';
export function LoadingState() { return <div className="page-state"><span className="spinner"/>Carregando...</div>; }
export function ErrorState({ message, onRetry }) { return <div className="page-state"><AlertCircle/><strong>Algo não saiu como esperado</strong><span>{message}</span>{onRetry && <button className="button button--secondary" onClick={onRetry}>Tentar novamente</button>}</div>; }
export function EmptyState({ title, text, action }) { return <div className="page-state"><Inbox/><strong>{title}</strong><span>{text}</span>{action}</div>; }
