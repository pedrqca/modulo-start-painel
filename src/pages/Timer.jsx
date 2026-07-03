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
  const [tempoRestante, setTempoRestante] = useState(() => Number(localStorage.getItem("tempoRestante") || 3600));
  const [timerAtivo, setTimerAtivo] = useState(() => localStorage.getItem("timerAtivo") === "true");
  const [tituloEvento, setTituloEvento] = useState(() => localStorage.getItem("tituloEvento") || "");

  useEffect(() => {
    const atualizarDoStorage = () => {
      setTempoRestante(Number(localStorage.getItem("tempoRestante") || 3600));
      setTimerAtivo(localStorage.getItem("timerAtivo") === "true");
      setTituloEvento(localStorage.getItem("tituloEvento") || "");
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

  return (
    <div ref={containerRef} className="telao-fundo">
      <button className="telao-btn-fs" onClick={alternarFullscreen}>
        {isFullscreen ? "🗗 Janela" : "🗖 Tela Cheia"}
      </button>

      <div className="telao-alinhamento">
        <div className="telao-top-tag">Temporizador Oficial</div>
        <h1 className="telao-header-txt">{tituloEvento}</h1>
        
        <div className={`telao-timer-txt ${timerAtivo ? "neon-ativo" : "neon-pausado"}`}>
          {formatarTempo(tempoRestante)}
        </div>

        <div className="telao-badge-status">
          <span className={`badge-indicator ${timerAtivo ? "cor-run" : "cor-stop"}`}>
            {timerAtivo ? "● EM EXECUÇÃO" : tempoRestante === 0 ? "■ TEMPO ESGOTADO" : "◌ PAUSADO"}
          </span>
        </div>
      </div>
    </div>
  );
}