const labels = { nova:'Nova', analisando:'Analisando', 'site-em-producao':'Em produção', 'site-pronto':'Site pronto', 'contato-pendente':'Contatar', apresentado:'Apresentado', cliente:'Cliente', recusou:'Recusou' };
export function StatusBadge({ status }) { return <span className={`badge badge--${status}`}>{labels[status] || status}</span>; }
