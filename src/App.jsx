import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import Header from "./components/Header";
import Temporizador from "./components/Temporizador";

const formatarTempo = (segundosTotais) => {
  const hrs = Math.floor(segundosTotais / 3600).toString().padStart(2, "0");
  const min = Math.floor((segundosTotais % 3600) / 60).toString().padStart(2, "0");
  const seg = (segundosTotais % 60).toString().padStart(2, "0");
  return `${hrs}:${min}:${seg}`;
};

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState("desafios"); 

  const [tituloEvento, setTituloEvento] = useState(() => {
    const salvo = localStorage.getItem("tituloEvento");
    return salvo ? salvo : "Módulo Start - Escola Padrão";
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
  const [timerAtivo, setTimerAtivo] = useState(false);

  const [equipes, setEquipes] = useState(() => {
    const salvas = localStorage.getItem("equipes");
    return salvas ? JSON.parse(salvas) : [];
  });

  const [novoNomeEquipe, setNovoNomeEquipe] = useState("");
  const [modalResetAberto, setModalResetAberto] = useState(false);
  const [modalAvisoVazioAberto, setModalAvisoVazioAberto] = useState(false);

  useEffect(() => {
    localStorage.setItem("tituloEvento", tituloEvento);
  }, [tituloEvento]);

  useEffect(() => {
    localStorage.setItem("equipes", JSON.stringify(equipes));
  }, [equipes]);

  useEffect(() => {
    localStorage.setItem("tempoRestante", tempoRestante);
  }, [tempoRestante]);

  useEffect(() => {
    localStorage.setItem("tempoDefinido", tempoDefinido);
  }, [tempoDefinido]);

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

  const iniciarTimer = () => { 
    if (tempoRestante > 0) setTimerAtivo(true); 
  };

  const pausarTimer = () => setTimerAtivo(false);

  const resetarTimer = () => { 
    setTimerAtivo(false); 
    setTempoRestante(tempoDefinido); 
  };
  
  const atualizarTempoInicial = () => {
    const segundosTotais = (Math.max(0, inputHoras) * 3600) + (Math.max(0, inputMinutos) * 60);
    const tempoFinal = segundosTotais > 0 ? segundosTotais : 60; 
    setTempoDefinido(tempoFinal);
    setTempoRestante(tempoFinal);
    setTimerAtivo(false);
  };

  const adicionarEquipe = (e) => {
    e.preventDefault();
    if (!novoNomeEquipe.trim()) return;

    const nova = {
      id: Date.now(),
      nome: novoNomeEquipe,
      pontosManual: 0, 
      exercicios: Array.from({ length: 10 }, () => ({
        status: "default",
        tempoEx: "",       
        tempoGastoSeg: 0   
      }))
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
        const novaPontuacao = Math.max(0, (eq.pontosManual || 0) + valor);
        return { ...eq, pontosManual: novaPontuacao };
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
      } else {
        tempoEx = "";
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

      const tempoA = a.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);
      const tempoB = b.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);
      return tempoA - tempoB;
    });
  }, [equipes]);

  const zerarCompeticao = () => {
    setModalResetAberto(true);
  };

  const confirmarZerarCompeticao = () => {
    setEquipes([]);
    setTempoRestante(3600);
    setTempoDefinido(3600);
    setTimerAtivo(false);
    setModalResetAberto(false);
  };

  const exportarCSV = () => {
    if (equipes.length === 0) {
      setModalAvisoVazioAberto(true);
      return;
    }

    let csv = `COMPETIÇÃO / LOCAL:;${tituloEvento};;;;;\n\n`;
    csv += "Rank;Equipe;Desafios;Missoes;Pontuação Total;Tempo Total Gasto;";
    
    for (let i = 1; i <= 10; i++) {
      csv += `EX ${i};`;
    }
    csv += "\n";

    equipesOrdenadas.forEach((eq, idx) => {
      const ptsEx = eq.exercicios.filter((e) => e.status === "validado").length;
      const totalPts = (eq.pontosManual || 0) + ptsEx;
      const tempoTotal = eq.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);
      
      csv += `${idx + 1};${eq.nome};${eq.pontosManual || 0};${ptsEx};${totalPts};${formatarTempo(tempoTotal)};`;
      
      eq.exercicios.forEach((ex) => {
        if (ex.status === "validado") {
          csv += `Validado (${ex.tempoEx});`;
        } else if (ex.status === "chamado") {
          csv += "Chamado;";
        } else {
          csv += "---;";
        }
      });
      
      csv += "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ranking_${tituloEvento.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <Header exportarCSV={exportarCSV} zerarCompeticao={zerarCompeticao} />
      
      <div className="abas-navegacao">
        <button 
          className={`btn-aba ${abaAtiva === "desafios" ? "active" : ""}`}
          onClick={() => setAbaAtiva("desafios")}
        >
          🚀 Desafios
        </button>
        <button 
          className={`btn-aba ${abaAtiva === "cronometro" ? "active" : ""}`}
          onClick={() => setAbaAtiva("cronometro")}
        >
          ⏱️ Cronômetro
        </button>
      </div>

      <div className="banner-evento-atual" style={{
        textAlign: "center",
        margin: "-5px 0 25px 0",
        padding: "10px 15px",
        background: "rgba(0, 93, 164, 0.1)",
        border: "1px dashed var(--cyber-ciano, #00f0ff)",
        borderRadius: "8px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontSize: "0.9rem"
      }}>
        <span style={{ color: "var(--texto-secundario)" }}>📍 ESCOLA: </span>
        <strong style={{ color: "#fff", textShadow: "0 0 8px rgba(0, 240, 255, 0.4)" }}>{tituloEvento}</strong>
      </div>
      
      {abaAtiva === "cronometro" ? (
        <>
          <Temporizador
            tempoRestante={tempoRestante}
            timerAtivo={timerAtivo}
            inputHoras={inputHoras}
            setInputHoras={setInputHoras}
            inputMinutos={inputMinutos}
            setInputMinutos={setInputMinutos}
            iniciarTimer={iniciarTimer}
            pausarTimer={pausarTimer}
            resetarTimer={resetarTimer}
            atualizarTempoInicial={atualizarTempoInicial}
            formatarTempo={formatarTempo}
          />

          <div className="wrapper-tabela">
            <table>
              <thead>
                <tr>
                  <th className="col-rank">Rank</th>
                  <th className="col-nome">Equipe</th>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <th key={i} className="celula-exercicio">EX{i + 1}</th>
                  ))}
                  <th className="col-total-pts">Total Pts</th>
                  <th className="col-total-tempo">Tempo Total</th>
                </tr>
              </thead>
              <tbody>
                {equipesOrdenadas.map((equipe, index) => {
                  const ptsEx = equipe.exercicios.filter((e) => e.status === "validado").length;
                  const totalPontos = (equipe.pontosManual || 0) + ptsEx;
                  const totalTempoGasto = equipe.exercicios.reduce((acc, e) => acc + e.tempoGastoSeg, 0);

                  return (
                    <tr key={equipe.id}>
                      <td className={`col-rank rank-${index + 1}`}>#{index + 1}</td>
                      <td className="col-nome">
                        <span className="nome-equipe-estatico">{equipe.nome}</span>
                      </td>

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

                      <td className="col-total-pts">{totalPontos}</td>
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
          <div className="secao-cadastro-desafios">
            <div className="config-titulo-evento" style={{ marginBottom: "25px", paddingBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--texto-secundario)", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                🏫 Nome da Escola / Etapa do Evento
              </label>
              <input
                type="text"
                style={{ width: "100%", maxWidth: "450px", padding: "10px 14px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff" }}
                placeholder="Ex: Escola SESI - Unidade Santa Rita"
                value={tituloEvento}
                onChange={(e) => setTituloEvento(e.target.value)}
              />
            </div>

            <h3>Painel de Controle e Registro de Equipes</h3>
            <form onSubmit={adicionarEquipe} className="add-equipe-form">
              <input
                type="text"
                placeholder="Ex: Equipe Alpha, Bravo..."
                value={novoNomeEquipe}
                onChange={(e) => setNovoNomeEquipe(e.target.value)}
              />
              <button type="submit" className="btn-add">+ Adicionar Equipe</button>
            </form>
          </div>

          <div className="grid-cards-desafios">
            {equipes.map((equipe) => (
              <div key={equipe.id} className="card-equipe-desafio">
                <div className="card-desafio-header">
                  <input
                    type="text"
                    className="nome-txt"
                    value={equipe.nome}
                    onChange={(e) => alterarNomeEquipe(equipe.id, e.target.value)}
                  />
                  <button className="btn-del-equipe" onClick={() => deletarEquipe(equipe.id)}>✕</button>
                </div>

                <div className="card-desafio-pontos">
                  <div className="label-pontos-card">
                    Pontuação Atual
                    <strong>{equipe.pontosManual || 0} pts</strong>
                  </div>
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
          <div className="modal-card critical-danger">
            <div className="modal-header">
              <span style={{ fontSize: "1.5rem" }}>🚨</span>
              <h2 className="modal-title">Apagar Todos os Dados?</h2>
            </div>
            <div className="modal-body">
              Tem certeza que deseja resetar a tabela? Isso apagará o progresso, as notas e os tempos de <strong style={{ color: "#fff" }}>todas as equipes</strong> de ambas as abas permanentemente. Essa ação não pode ser desfeita.
            </div>
            <div className="modal-footer">
              <button className="btn-util" onClick={() => setModalResetAberto(false)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmarZerarCompeticao}>Sim, Resetar Tudo</button>
            </div>
          </div>
        </div>
      )}

      {modalAvisoVazioAberto && (
        <div className="modal-overlay">
          <div className="modal-card warning-alert">
            <div className="modal-header">
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <h2 className="modal-title">Exportação Inválida</h2>
            </div>
            <div className="modal-body">
              Não foi possível gerar o relatório. A tabela está atualmente <strong style={{ color: "#fff" }}>vazia</strong>. Adicione pelo menos uma equipe na aba Desafios antes de tentar exportar o arquivo CSV.
            </div>
            <div className="modal-footer">
              <button className="btn-util" style={{ backgroundColor: "var(--azul-start)" }} onClick={() => setModalAvisoVazioAberto(false)}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}