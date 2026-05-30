export default function Temporizador({
  tempoRestante,
  timerAtivo,
  inputHoras,
  setInputHoras,
  inputMinutos,
  setInputMinutos,
  iniciarTimer,
  pausarTimer,
  resetarTimer,
  atualizarTempoInicial,
  formatarTempo
}) {
  return (
    <div className="painel-cronometro">
      <div className="display-tempo">
        {formatarTempo(tempoRestante)}
      </div>

      {!timerAtivo && (
        <div className="config-temporizador-card">
          <div className="input-group-timer">
            <input
              type="number"
              value={inputHoras}
              onChange={(e) => setInputHoras(parseInt(e.target.value, 10) || 0)}
              min="0"
              max="24"
              className="input-timer"
            />
            <span className="label-timer">H</span>
          </div>

          <div className="input-group-timer">
            <input
              type="number"
              value={inputMinutos}
              onChange={(e) => setInputMinutos(parseInt(e.target.value, 10) || 0)}
              min="0"
              max="59"
              className="input-timer"
            />
            <span className="label-timer">M</span>
          </div>

          <button onClick={atualizarTempoInicial} className="btn-definir-tempo">
            Definir Tempo
          </button>
        </div>
      )}

      <div className="controles-cronometro" style={{ marginTop: timerAtivo ? '20px' : '5px' }}>
        <button onClick={iniciarTimer} className="btn-cron btn-start" disabled={timerAtivo}>
          Iniciar
        </button>
        <button onClick={pausarTimer} className="btn-cron btn-pause" disabled={!timerAtivo}>
          Pausar
        </button>
        <button onClick={resetarTimer} className="btn-cron btn-reset">
          Resetar
        </button>
      </div>
    </div>
  );
}