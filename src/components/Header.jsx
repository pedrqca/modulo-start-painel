import React from 'react';

export default function Header({ exportarCSV, zerarCompeticao }) {
  return (
    <header>
      <div className="logo-text-wrapper">
        <img src="/logo_start.png" className="logo-header" alt="Start Engenharia" />
        <h1>Cronometro <span>Start_Engenharias</span></h1>
      </div>
      
      {/* Botões realocados para a lateral direita superior */}
      <div className="botoes-topo">
        <button className="btn-util" onClick={exportarCSV}>
          Exportar CSV
        </button>
        <button className="btn-danger" onClick={zerarCompeticao}>
          Zerar Competição
        </button>
        <button className="btn-util" onClick={() => document.documentElement.requestFullscreen()}>
          Tela Cheia
        </button>
      </div>
    </header>
  );
}