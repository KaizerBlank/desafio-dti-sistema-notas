import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() { 

  // inputs temporários
  const [nome, setNome] = useState('')
  const [notasStr, setNotasStr] = useState('') 
  const [frequencia, setFrequencia] = useState('')

  // lista de alunos 
  const [listaAlunos, setListaAlunos] = useState([])

  // resultado
  const [resultado, setResultado] = useState(null)

  // fUNÇÕES

  // função para adicionar o aluno do formulário na lista temporária
  const adicionarNaLista = () => {
    if (!nome || !notasStr || !frequencia) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    const arrayNotas = notasStr
      .split(/[\s,]+/)                 
      .filter(n => n.trim() !== '')    
      .map(n => parseFloat(n.trim()));

      if (arrayNotas.length !== 5) {
      alert(`Atenção: Você digitou ${arrayNotas.length} notas. São necessárias exatamente 5!`);
      return; 
    }
    // converte a string em array de números
    if (arrayNotas.some(isNaN)) {
        alert("As notas devem ser apenas números.");
        return;
    }

  const novoAluno = {
    name: nome,        
    grades: arrayNotas,
    frequency: parseFloat(frequencia)
  };
    setListaAlunos([...listaAlunos, novoAluno]); 
    
    setNome('');
    setNotasStr('');
    setFrequencia('');
  };

  const processarCalculos = async () => {
    try {
      const resposta = await axios.post('http://localhost:5262/api/Boletim/calcular', listaAlunos);
      setResultado(resposta.data);
    } catch (erro) {
      alert("Erro ao conectar com o servidor C#. Ele está rodando?");
      console.error(erro);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Sistema de Notas - DTI</h1>

      {/* formulário de cadastro */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>1. Adicionar Aluno</h3>
        <input 
          placeholder="Nome" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          style={{ marginRight: '10px' }}
        />
        <input 
          placeholder="Notas (ex: 8,9,7,6,10)" 
          value={notasStr} 
          onChange={e => setNotasStr(e.target.value)} 
          style={{ marginRight: '10px', width: '200px' }}
        />
        <input 
          placeholder="Freq % (ex: 85)" 
          type="number"
          value={frequencia} 
          onChange={e => setFrequencia(e.target.value)} 
          style={{ marginRight: '10px', width: '100px' }}
        />
        <button onClick={adicionarNaLista}>Adicionar à Lista</button>
      </div>

      {/* lista de espera para envio */}
      {listaAlunos.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Alunos prontos para envio ({listaAlunos.length}):</h3>
          <ul>
            {listaAlunos.map((aluno, index) => (
              <li key={index}>
                {aluno.name} - Notas: {aluno.grades.join(', ')} - Freq: {aluno.frequency}%
              </li>
            ))}
          </ul>
          <button onClick={processarCalculos} style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}>
            CALCULAR RESULTADOS
          </button>
        </div>
      )}

      {/* resultados */}
      {resultado && (
        <div style={{ border: '2px solid blue', padding: '15px', marginTop: '20px' }}>
          <h2>Resultados Processados</h2>
          
          <h3>Boletim Geral:</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#000000' }}>
                <th>Nome</th>
                <th>Média Final</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              {resultado.relatorioAlunos.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td> 
                  <td>{r.media.toFixed(2)}</td>
                  <td>{r.frequency}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Médias da Turma por Disciplina:</h3>
          <p>
            {resultado.mediaTurmaPorDisciplina
                .map(nota => nota.toFixed(2))
                .join(' | ') 
            }
          </p>

          {/* destaques */}
          <h3 style={{ color: 'green', marginTop: '20px' }}>Destaques (Acima da Média):</h3>
          
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
             {resultado.relatorioAlunos.length === 1 ? (
                <li>Nenhum (Pois só há um aluno na turma)</li>
             ) : (
                resultado.alunoDestaque.length > 0 ? 
                  resultado.alunoDestaque.map((nome, i) => <li key={i}>{nome}</li>) 
                  : <li>Nenhum</li>
             )}
          </ul>

          {/* recuperação */}
          <h3 style={{ color: 'red', marginTop: '20px' }}>Recuperação (Freq Baixa):</h3>
          
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
             {resultado.alunosRecuperacao.length > 0 ? 
                resultado.alunosRecuperacao.map((nome, i) => <li key={i}>{nome}</li>) 
                : <li>Nenhum</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App