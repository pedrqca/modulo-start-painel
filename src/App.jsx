import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Temporizador from "./components/Temporizador";
import Timer from "./pages/Timer";

const formatarTempo = (segundosTotais) => {
  const hrs = Math.floor(segundosTotais / 3600).toString().padStart(2, "0");
  const min = Math.floor((segundosTotais % 3600) / 60).toString().padStart(2, "0");
  const seg = (segundosTotais % 60).toString().padStart(2, "0");
  return `${hrs}:${min}:${seg}`;
};

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState("desafios"); 

  // ==========================================
  // ESTADOS DO CRONÔMETRO GERAL (ABA CRONÔMETRO)
  // ==========================================
  const [tituloEvento, setTituloEvento] = useState(() => {
    return localStorage.getItem("tituloEvento") || "Módulo Start - Escola Padrão";
  });

  const [tempoRestante, setTempoRestante] = useState(() => {
    const salvo = localStorage.getItem("tempoRestante");
    return salvo ? Number(salvo) : 3600;
  }); 

  const [tempoDefinido, setTempoDefinido] = useState(() => {
    const salvo = localStorage.getItem("tempoDefinido");
    return salvo ? Number(salvo) : 3600;
  });

  const [inputHoras, setInputHoras] = useState(1);
  const [inputMinutos, setInputMinutos] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(() => {
    return localStorage.getItem("timerAtivo") === "true";
  });

  // ==========================================
  // ESTADOS DO NOVO TEMPORIZADOR (ABA DESAFIOS)
  // ==========================================
  const [tempoRestanteDesafios, setTempoRestanteDesafios] = useState(() => {
    const salvo = localStorage.getItem("tempoRestanteDesafios");
    return salvo ? Number(salvo) : 300; 
  });

  const [tempoDefinidoDesafios, setTempoDefinidoDesafios] = useState(() => {
    const salvo = localStorage.getItem("tempoDefinidoDesafios");
    return salvo ? Number(salvo) : 300;
  });

  const [inputMinutosDesafios, setInputMinutosDesafios] = useState(5);
  const [timerDesafiosAtivo, setTimerDesafiosAtivo] = useState(() => {
    return localStorage.getItem("timerDesafiosAtivo") === "true";
  });

  // ==========================================
  // ESTADOS DAS EQUIPES E MODAIS
  // ==========================================
  const [equipes, setEquipes] = useState(() => {
    const salvas = localStorage.getItem("equipes");
    return salvas ? JSON.parse(salvas) : [];
  });

  const [novoNomeEquipe, setNovoNomeEquipe] = useState("");
  const [modalResetAberto, setModalResetAberto] = useState(false);
  const [modalAvisoVazioAberto, setModalAvisoVazioAberto] = useState(false);

  // ==========================================
  // EFEITOS DE PERSISTÊNCIA (LOCALSTORAGE)
  // ==========================================
  useEffect(() => {
    localStorage.setItem("tituloEvento", tituloEvento);
  }, [tituloEvento]);

  useEffect(() => {
    localStorage.setItem("equipes", JSON.stringify(equipes));
  }, [equipes]);

  // Sincroniza a aba ativa para o telão saber o que renderizar
  useEffect(() => {
    localStorage.setItem("abaAtiva", abaAtiva);
  }, [abaAtiva]);

  // Sincronização do Cronômetro Geral
  useEffect(() => { localStorage.setItem("tempoRestante", tempoRestante.toString()); }, [tempoRestante]);
  useEffect(() => { localStorage.setItem("tempoDefinido", tempoDefinido.toString()); }, [tempoDefinido]);
  useEffect(() => { localStorage.setItem("timerAtivo", timerAtivo.toString()); }, [timerAtivo]);

  // Sincronização do Cronômetro de Desafios
  useEffect(() => { localStorage.setItem("tempoRestanteDesafios", tempoRestanteDesafios.toString()); }, [tempoRestanteDesafios]);
  useEffect(() => { localStorage.setItem("tempoDefinidoDesafios", tempoDefinidoDesafios.toString()); }, [tempoDefinidoDesafios]);
  useEffect(() => { localStorage.setItem("timerDesafiosAtivo", timerDesafiosAtivo.toString()); }, [timerDesafiosAtivo]);

  // ==========================================
  // LOOPS DOS TIMERS (INTERVALOS INDEPENDENTES)
  // ==========================================
  
  // Loop do Cronômetro Geral
  useEffect(() => {
    if (!timerAtivo) return;
    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          setTimerAtivo(false);
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [timerAtivo]);

  // Loop do Cronômetro de Desafios
  useEffect(() => {
    if (!timerDesafiosAtivo) return;
    const intervalo = setInterval(() => {
      setTempoRestanteDesafios((prev) => {
        if (prev <= 1) {
          setTimerDesafiosAtivo(false);
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [timerDesafiosAtivo]);

  // Sincronização entre abas/janelas abertas externa
  useEffect(() => {
    const sincronizarTabs = (e) => {
      if (e.key === "tempoRestante") setTempoRestante(Number(e.newValue));
      if (e.key === "timerAtivo") setTimerAtivo(e.newValue === "true");
      if (e.key === "tempoRestanteDesafios") setTempoRestanteDesafios(Number(e.newValue));
      if (e.key === "timerDesafiosAtivo") setTimerDesafiosAtivo(e.newValue === "true");
    };
    window.addEventListener("storage", sincronizarTabs);
    return () => window.removeEventListener("storage", sincronizarTabs);
  }, []);

  // ==========================================
  // FUNÇÕES DE CONTROLE - CRONÔMETRO GERAL
  // ==========================================
  const iniciarTimer = () => { if (tempoRestante > 0) setTimerAtivo(true); };
  const pausarTimer = () => setTimerAtivo(false);
  const resetarTimer = () => { setTimerAtivo(false); setTempoRestante(tempoDefinido); };
  const atualizarTempoInicial = () => {
    const segundosTotais = (Math.max(0, inputHoras) * 3600) + (Math.max(0, inputMinutos) * 60);
    const tempoFinal = segundosTotais > 0 ? segundosTotais : 60; 
    setTempoDefinido(tempoFinal);
    setTempoRestante(tempoFinal);
    setTimerAtivo(false);
  };

  // ==========================================
  // FUNÇÕES DE CONTROLE - TEMPORIZADOR DESAFIOS
  // ==========================================
  const iniciarTimerDesafios = () => { if (tempoRestanteDesafios > 0) setTimerDesafiosAtivo(true); };
  const pausarTimerDesafios = () => setTimerDesafiosAtivo(false);
  const resetarTimerDesafios = () => { setTimerDesafiosAtivo(false); setTempoRestanteDesafios(tempoDefinidoDesafios); };
  const atualizarTempoDesafios = () => {
    const segundosTotais = Math.max(0, inputMinutosDesafios) * 60;
    const tempoFinal = segundosTotais > 0 ? segundosTotais : 60;
    setTempoDefinidoDesafios(tempoFinal);
    setTempoRestanteDesafios(tempoFinal);
    setTimerDesafiosAtivo(false);
  };

    const abrirAbaTelan = () => {
  window.open("?telao=true", "_blank", "noopener,noreferrer");
};

  // ==========================================
  // GERENCIAMENTO DAS EQUIPES
  // ==========================================
  const adicionarEquipe = (e) => {
    e.preventDefault();
    if (!novoNomeEquipe.trim()) return;

    const nova = {
      id: Date.now(),
      nome: novoNomeEquipe,
      pontosManual: 0, 
      exercicios: Array.from({ length: 10 }, () => ({ status: "default", tempoEx: "", tempoGastoSeg: 0 }))
    };
    setEquipes([...equipes, nova]);
    setNovoNomeEquipe("");
  };

  const deletarEquipe = (id) => setEquipes(equipes.filter((eq) => eq.id !== id));
  const alterarNomeEquipe = (id, novoNome) => {
    setEquipes(equipes.map((eq) => eq.id === id ? { ...eq, nome: novoNome } : eq));
  };

  const alterarPontosManual = (id, valor) => {
    setEquipes(equipes.map((eq) => {
      if (eq.id === id) {
        return { ...eq, pontosManual: Math.max(0, (eq.pontosManual || 0) + valor) };
      }
      return eq;
    }));
  };

  const alterarStatusEx = (equipeId, exIndex, novoStatus) => {
    setEquipes(equipes.map((eq) => {
      if (eq.id !== equipeId) return eq;

      const novosExercicios = [...eq.exercicios];
      let tempoEx = "";
      let tempoGastoSeg = 0;

      if (novoStatus === "validado") {
        tempoGastoSeg = tempoDefinido - tempoRestante;
        tempoEx = formatarTempo(tempoRestante);
      } else if (novoStatus === "chamado") {
        tempoEx = "CHAMADO";
      }

      novosExercicios[exIndex] = { status: novoStatus, tempoEx, tempoGastoSeg };
      return { ...eq, exercicios: novosExercicios };
    }));
  };

  const equipesOrdenadas = useMemo(() => {
    return [...equipes].sort((a, b) => {
      const ptsA = (a.pontosManual || 0) + a.exercicios.filter((e) => e.status === "validado").length;
      const ptsB = (b.pontosManual || 0) + b.exercicios.filter((e) => e.status === "validado").length;
      if (ptsB !== ptsA) return ptsB - ptsA;
      return a.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0) - b.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);
    });
  }, [equipes]);

  const zerarCompeticao = () => setModalResetAberto(true);
  const confirmarZerarCompeticao = () => {
    setEquipes([]);
    setTempoRestante(3600);
    setTempoDefinido(3600);
    setTempoRestanteDesafios(300);
    setTempoDefinidoDesafios(300);
    setTimerAtivo(false);
    setTimerDesafiosAtivo(false);
    setModalResetAberto(false);
  };

  const exportarCSV = () => {
    if (equipes.length === 0) { setModalAvisoVazioAberto(true); return; }
    let csv = `COMPETIÇÃO / LOCAL:;${tituloEvento};;;;;\n\nRank;Equipe;Desafios;Missoes;Pontuação Total;Tempo Total Gasto;`;
    for (let i = 1; i <= 10; i++) csv += `EX ${i};`;
    csv += "\n";

    equipesOrdenadas.forEach((eq, idx) => {
      const ptsEx = eq.exercicios.filter((e) => e.status === "validado").length;
      const totalTempo = eq.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);
      csv += `${idx + 1};${eq.nome};${eq.pontosManual || 0};${ptsEx};${(eq.pontosManual || 0) + ptsEx};${formatarTempo(totalTempo)};`;
      eq.exercicios.forEach((ex) => {
        csv += ex.status === "validado" ? `Validado (${ex.tempoEx});` : ex.status === "chamado" ? "Chamado;" : "---;";
      });
      csv += "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ranking_${tituloEvento.toLowerCase().replace(/\s+/g, "_")}.csv`;
    link.click();
  };

  return (
    <div className="container">
      <Header exportarCSV={exportarCSV} zerarCompeticao={zerarCompeticao} />
      
      <div className="abas-navegacao">
        <button className={`btn-aba ${abaAtiva === "desafios" ? "active" : ""}`} onClick={() => setAbaAtiva("desafios")}>🚀 Desafios</button>
        <button className={`btn-aba ${abaAtiva === "cronometro" ? "active" : ""}`} onClick={() => setAbaAtiva("cronometro")}>⏱️ Cronômetro</button>
      </div>

      {/* Seção unificada de controle do Telão e Banner do Evento */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "15px", flexWrap: "wrap" }}>
        <div className="banner-evento-atual" style={{
          margin: 0, padding: "10px 15px", flex: 1, textAlign: "left",
          background: "rgba(0, 93, 164, 0.1)", border: "1px dashed var(--cyber-ciano, #00f0ff)",
          borderRadius: "8px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.9rem"
        }}>
          <span style={{ color: "var(--texto-secundario)" }}>📍 ESCOLA: </span>
          <strong style={{ color: "#fff", textShadow: "0 0 8px rgba(0, 240, 255, 0.4)" }}>{tituloEvento}</strong>
        </div>
        <button className="btn-util" onClick={abrirAbaTelan} style={{ border: "1px solid var(--cyber-ciano)", color: "var(--cyber-ciano)", height: "38px" }}>
          🖥️ Abrir Aba do Telão Exterior
        </button>
      </div>

      {abaAtiva === "cronometro" ? (
        <>
          <Temporizador
            tempoRestante={tempoRestante} timerAtivo={timerAtivo}
            inputHoras={inputHoras} setInputHoras={setInputHoras}
            inputMinutos={inputMinutos} setInputMinutos={setInputMinutos}
            iniciarTimer={iniciarTimer} pausarTimer={pausarTimer} resetarTimer={resetarTimer}
            atualizarTempoInicial={atualizarTempoInicial} formatarTempo={formatarTempo}
          />

          <div className="wrapper-tabela">
            <table>
              <thead>
                <tr>
                  <th className="col-rank">Rank</th>
                  <th className="col-nome">Equipe</th>
                  {Array.from({ length: 10 }).map((_, i) => (<th key={i} className="celula-exercicio">EX{i + 1}</th>))}
                  <th className="col-total-pts">Pts Ex</th>
                  <th className="col-total-tempo">Tempo Total</th>
                </tr>
              </thead>
              <tbody>
                {equipesOrdenadas.map((equipe, index) => {
                  const ptsEx = equipe.exercicios.filter((e) => e.status === "validado").length;
                  const totalTempoGasto = equipe.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);

                  return (
                    <tr key={equipe.id}>
                      <td className={`col-rank rank-${index + 1}`}>#{index + 1}</td>
                      <td className="col-nome"><span className="nome-equipe-estatico">{equipe.nome}</span></td>
                      {equipe.exercicios.map((ex, exIdx) => (
                        <td key={exIdx} className="celula-exercicio">
                          <div className={`container-exercicio ${ex.status}`}>
                            <span className="timestamp-ex">{ex.tempoEx || "--:--"}</span>
                            <div className="wrapper-acoes-ex">
                              <button className="btn-ex btn-chamar" onClick={() => alterarStatusEx(equipe.id, exIdx, "chamado")}>▶</button>
                              <button className="btn-ex btn-validar" onClick={() => alterarStatusEx(equipe.id, exIdx, "validado")}>✓</button>
                              <button className="btn-ex btn-apagar" onClick={() => alterarStatusEx(equipe.id, exIdx, "default")}>✕</button>
                            </div>
                          </div>
                        </td>
                      ))}
                      <td className="col-total-pts">{ptsEx}</td>
                      <td className="col-total-tempo">{formatarTempo(totalTempoGasto)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* ======================================================= */}
          {/* BLCO DE TEMPORIZADOR EXCLUSIVO DA ABA DE DESAFIOS       */}
          {/* ======================================================= */}
          <div className="painel-cronometro" style={{ marginBottom: "30px", border: "1px dashed var(--laranja-start, #fbc02d)" }}>
            <div style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--laranja-start)", letterSpacing: "1px", marginBottom: "5px" }}>
              ⏱️ Temporizador de Desafios
            </div>
            <div className="display-tempo" style={{ fontSize: "4.5rem", color: "var(--cyber-ciano, #00f0ff)", textShadow: "0 0 15px rgba(0,240,255,0.3)" }}>
              {formatarTempo(tempoRestanteDesafios)}
            </div>

            {!timerDesafiosAtivo && (
              <div className="config-temporizador-card" style={{ margin: "5px auto 15px auto", padding: "8px 16px" }}>
                <div className="input-group-timer">
                  <input 
                    type="number" 
                    value={inputMinutosDesafios} 
                    onChange={(e) => setInputMinutosDesafios(parseInt(e.target.value, 10) || 0)} 
                    min="0" max="180" 
                    className="input-timer" 
                  />
                  <span className="label-timer">Minutos</span>
                </div>
                <button onClick={atualizarTempoDesafios} className="btn-definir-tempo" style={{ height: "34px" }}>Definir</button>
              </div>
            )}

            <div className="controles-cronometro" style={{ marginTop: timerDesafiosAtivo ? '10px' : '5px' }}>
              <button onClick={iniciarTimerDesafios} className="btn-cron btn-start" disabled={timerDesafiosAtivo}>Iniciar</button>
              <button onClick={pausarTimerDesafios} className="btn-cron btn-pause" disabled={!timerDesafiosAtivo}>Pausar</button>
              <button onClick={resetarTimerDesafios} className="btn-cron btn-reset">Resetar</button>
            </div>
          </div>
          {/* ======================================================= */}

          <div className="secao-cadastro-desafios">
            <div className="config-titulo-evento" style={{ marginBottom: "25px", paddingBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--texto-secundario)", textTransform: "uppercase", marginBottom: "8px" }}>
                🏫 Nome da Escola / Etapa do Evento
              </label>
              <input
                type="text"
                style={{ width: "100%", maxWidth: "450px", padding: "10px 14px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff" }}
                placeholder="Ex: Escola SESI"
                value={tituloEvento}
                onChange={(e) => setTituloEvento(e.target.value)}
              />
            </div>
            <h3>Painel de Controle e Registro de Equipes</h3>
            <form onSubmit={adicionarEquipe} className="add-equipe-form" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input type="text" placeholder="Ex: Equipe Alpha..." value={novoNomeEquipe} onChange={(e) => setNovoNomeEquipe(e.target.value)} style={{ padding: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} />
              <button type="submit" className="btn-util" style={{ backgroundColor: "var(--azul-start)" }}>+ Adicionar Equipe</button>
            </form>
          </div>

          <div className="grid-cards-desafios">
            {equipes.map((equipe) => (
              <div key={equipe.id} className="card-equipe-desafio">
                <div className="card-desafio-header">
                  <input type="text" className="nome-txt" value={equipe.nome} onChange={(e) => alterarNomeEquipe(equipe.id, e.target.value)} style={{ color: "#fff", background: "transparent" }} />
                  <button className="btn-controle-ponto menos" onClick={() => deletarEquipe(equipe.id)}>✕</button>
                </div>
                <div className="card-desafio-pontos">
                  <div className="label-pontos-card">Pontuação Desafios <strong>{equipe.pontosManual || 0} pts</strong></div>
                  <div className="wrapper-botoes-pontos">
                    <button className="btn-controle-ponto menos" onClick={() => alterarPontosManual(equipe.id, -1)}>-</button>
                    <button className="btn-controle-ponto mais" onClick={() => alterarPontosManual(equipe.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {modalResetAberto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>🚨 Apagar Todos os Dados?</h2>
            <p style={{ margin: "15px 0", color: "var(--texto-secundario)" }}>Tem certeza que deseja resetar? Isso limpará permanentemente o progresso e tempos de todas as equipes.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-util" onClick={() => setModalResetAberto(false)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmarZerarCompeticao}>Sim, Resetar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}