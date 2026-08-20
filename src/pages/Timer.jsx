import React, { useState, useEffect, useRef } from "react";
import "../styles/Timer.css";

const formatarTempo = (segundosTotais) => {
  const hrs = Math.floor(segundosTotais / 3600).toString().padStart(2, "0");
  const min = Math.floor((segundosTotais % 3600) / 60).toString().padStart(2, "0");
  const seg = (segundosTotais % 60).toString().padStart(2, "0");
  return `${hrs}:${min}:${seg}`;
};

export default function Timer() {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Lê qual aba o operador está visualizando para espelhar por padrão
  const [visaoAtiva, setVisaoAtiva] = useState(() => {
    const abaPainel = localStorage.getItem("abaAtiva");
    return abaPainel === "cronometro" ? "geral" : "desafios";
  });

  // Estados do Cronômetro Geral
  const [tempoRestante, setTempoRestante] = useState(() => Number(localStorage.getItem("tempoRestante") || 3600));
  const [timerAtivo, setTimerAtivo] = useState(() => localStorage.getItem("timerAtivo") === "true");
  
  // Estados do Cronômetro de Desafios
  const [tempoRestanteDesafios, setTempoRestanteDesafios] = useState(() => Number(localStorage.getItem("tempoRestanteDesafios") || 300));
  const [timerDesafiosAtivo, setTimerDesafiosAtivo] = useState(() => localStorage.getItem("timerDesafiosAtivo") === "true");

  const [tituloEvento, setTituloEvento] = useState(() => localStorage.getItem("tituloEvento") || "");

  useEffect(() => {
    const atualizarDoStorage = () => {
      setTempoRestante(Number(localStorage.getItem("tempoRestante") || 3600));
      setTimerAtivo(localStorage.getItem("timerAtivo") === "true");
      
      setTempoRestanteDesafios(Number(localStorage.getItem("tempoRestanteDesafios") || 300));
      setTimerDesafiosAtivo(localStorage.getItem("timerDesafiosAtivo") === "true");
      
      setTituloEvento(localStorage.getItem("tituloEvento") || "");

      // Sincroniza a visão do telão caso o operador mude de aba no painel principal
      const abaPainel = localStorage.getItem("abaAtiva");
      if (abaPainel) {
        setVisaoAtiva(abaPainel === "cronometro" ? "geral" : "desafios");
      }
    };

    window.addEventListener("storage", atualizarDoStorage);
    const loopSeguro = setInterval(atualizarDoStorage, 250);

    return () => {
      window.removeEventListener("storage", atualizarDoStorage);
      clearInterval(loopSeguro);
    };
  }, []);

  const alternarFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Define qual tempo e status exibir com base na visão selecionada
  const tempoExibido = visaoAtiva === "geral" ? tempoRestante : tempoRestanteDesafios;
  const statusAtivo = visaoAtiva === "geral" ? timerAtivo : timerDesafiosAtivo;

  return (
    <div ref={containerRef} className="telao-fundo">
      {/* Controles superiores do Telão */}
      <div className="telao-controles-topo">
        <div className="telao-alternador-abas">
          <button 
            className={`btn-telao-aba ${visaoAtiva === "geral" ? "ativa" : ""}`} 
            onClick={() => setVisaoAtiva("geral")}
          >
            ⏱️ Cronômetro Geral
          </button>
          <button 
            className={`btn-telao-aba ${visaoAtiva === "desafios" ? "ativa" : ""}`} 
            onClick={() => setVisaoAtiva("desafios")}
          >
            🚀 Timer Desafios
          </button>
        </div>

        <button className="telao-btn-fs" onClick={alternarFullscreen}>
          {isFullscreen ? "🗗 Janela" : "🗖 Tela Cheia"}
        </button>
      </div>

      <div className="telao-alinhamento">
        <div className="telao-top-tag">
          {visaoAtiva === "geral" ? "Cronômetro Oficial da Competição" : "Temporizador de Atividade Extra"}
        </div>
        <h1 className="telao-header-txt">{tituloEvento}</h1>
        
        <div className={`telao-timer-txt ${statusAtivo ? "neon-ativo" : "neon-pausado"}`}>
          {formatarTempo(tempoExibido)}
        </div>

        <div className="telao-badge-status">
          <span className={`badge-indicator ${statusAtivo ? "cor-run" : "cor-stop"}`}>
            {statusAtivo ? "● EM EXECUÇÃO" : tempoExibido === 0 ? "■ TEMPO ESGOTADO" : "◌ PAUSADO"}
          </span>
        </div>
      </div>
    </div>
  );
}