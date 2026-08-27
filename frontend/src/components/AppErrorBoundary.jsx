import React from 'react';

export class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Erro ao renderizar a página:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <main className="page"><section className="panel empty-state">
      <h1>Não foi possível abrir esta tela</h1>
      <p>Encontramos um conteúdo antigo ou incompleto. Recarregue a página e tente novamente.</p>
      <button className="button button--primary" onClick={() => window.location.reload()}>Recarregar página</button>
      <details><summary>Detalhes técnicos</summary><pre>{this.state.error.message}</pre></details>
    </section></main>;
  }
}
