using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GestaoEscolarAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoletimController : ControllerBase
    {
        [HttpPost("Calcular")]
        public IActionResult CalcularResultados([FromBody] List<Aluno> alunos)
        {
            // Bloco try para evitar erros
            try
            {
                // Se a lista for nula ou vazia, rejeita imediatamente para evitar erros
                if (alunos == null || alunos.Count == 0)
                {
                    return BadRequest("A lista de alunos não pode estar vazia.");
                }

                // Validação de Integridade: Verifica se ALGUÉM quebrou a regra das 5 notas.
                var alunoComErro = alunos.FirstOrDefault(a => a.grades.Count != 5);
                if (alunoComErro != null)
                {
                    return BadRequest($"O aluno {alunoComErro.name} possui {alunoComErro.grades.Count} notas. São necessárias 5 notas.");
                }
            

            var boletimAlunos = alunos.Select(a => new
            {
                name = a.name,
                media = a.grades.Average(),
                frequency = a.frequency
            }).ToList();

            var mediaPorDisciplina = new List<double>();
            for (int i = 0; i < 5; i++)
            {
                double mediaDisciplina = alunos.Average(a => a.grades[i]);
                mediaPorDisciplina.Add(mediaDisciplina);
            }

            double mediaGeralTurma = mediaPorDisciplina.Average();
            var alunosAcimaDaMedia = new List<string>();

            // Evita dizer que o aluno é destaque comparado com ele mesmo.
            if (alunos.Count > 1)
            {
                mediaGeralTurma = mediaPorDisciplina.Average();

                alunosAcimaDaMedia = boletimAlunos
                    .Where(a => a.media > mediaGeralTurma) // A média do aluno > média da sala
                    .Select(a => a.name) 
                    .ToList();
            }

            // Recuperação
            var alunosFrequenciaBaixa = boletimAlunos
                .Where(a => a.frequency < 75)
                .Select(a => a.name)
                .ToList();

            // Retorna um JSON formatado com todas as listas processadas
            return Ok(new
            {
                RelatorioAlunos = boletimAlunos,
                MediaTurmaPorDisciplina = mediaPorDisciplina,
                AlunoDestaque = alunosAcimaDaMedia,
                AlunosRecuperacao = alunosFrequenciaBaixa
            });
            }
            catch (Exception ex)
            {
                // Retorna erro 500 (Internal Server Error)
                return StatusCode(500, $"Ocorreu um erro interno: {ex.Message}");
            }
        }
    }
}