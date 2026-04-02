using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocadoraAPI.Data;
using LocadoraAPI.Models;

namespace LocadoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlugueisController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public AlugueisController(LocadoraContext context)
        {
            _context = context;
        }

        // GET: api/Alugueis - Lista todos os alugueis com dados do cliente e veiculo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetAlugueis()
        {
            // Usamos Include para trazer dados relacionados (JOINs)
            return await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .ToListAsync();
        }

        // GET: api/Alugueis/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Aluguel>> GetAluguel(int id)
        {
            var aluguel = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound();
            }

            return aluguel;
        }

        // POST: api/Alugueis - Cria um novo aluguel
        [HttpPost]
        public async Task<ActionResult<Aluguel>> PostAluguel(Aluguel aluguel)
        {
            // --- LÓGICA 1: VERIFICAR DISPONIBILIDADE DO VEÍCULO ---
            var veiculo = await _context.Veiculos.FindAsync(aluguel.VeiculoId);
            if (veiculo == null)
            {
                return BadRequest("Veículo inválido.");
            }

            if (!veiculo.Disponivel)
            {
                return BadRequest("O veículo selecionado não está disponível para aluguel.");
            }

            // --- LÓGICA 2 (NOVA): VERIFICAR SALDO DO CLIENTE ---
            var cliente = await _context.Clientes.FindAsync(aluguel.ClienteId);
            if (cliente == null)
            {
                return BadRequest("Cliente inválido.");
            }

            // Verifica se o cliente tem saldo suficiente para pelo menos 1 diária
            if (cliente.Saldo < aluguel.ValorDiaria)
            {
                return BadRequest($"Saldo insuficiente. O cliente possui R$ {cliente.Saldo}, mas a diária custa R$ {aluguel.ValorDiaria}.");
            }

            // --- FIM DA NOVA LÓGICA ---

            // Marca o veículo como indisponível
            veiculo.Disponivel = false;
            _context.Entry(veiculo).State = EntityState.Modified;

            // Define os dados iniciais do aluguel
            aluguel.DataInicio = DateTime.Now;
            aluguel.QuilometragemInicial = veiculo.Quilometragem;

            _context.Alugueis.Add(aluguel);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAluguel", new { id = aluguel.Id }, aluguel);
        }

        // PUT: api/Alugueis/5/devolucao - Endpoint específico para devolução
        [HttpPut("{id}/devolucao")]
        public async Task<IActionResult> DevolverVeiculo(int id, [FromBody] int quilometragemFinal)
        {
            var aluguel = await _context.Alugueis
                .Include(a => a.Veiculo) // Precisamos do veículo para atualizá-lo
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound("Aluguel não encontrado.");
            }

            if (aluguel.DataDevolucaoReal.HasValue)
            {
                return BadRequest("Este veículo já foi devolvido.");
            }

            var veiculo = aluguel.Veiculo;

            if (quilometragemFinal < veiculo.Quilometragem)
            {
                return BadRequest("A quilometragem final não pode ser menor que a quilometragem atual do veículo.");
            }

            // --- LÓGICA DE NEGÓCIO: ATUALIZAR DADOS NA DEVOLUÇÃO ---
            aluguel.DataDevolucaoReal = DateTime.Now;
            aluguel.QuilometragemFinal = quilometragemFinal;

            // Calcula o número de dias do aluguel
            var diasAlugado = (aluguel.DataDevolucaoReal.Value - aluguel.DataInicio).Days;
            if (diasAlugado == 0) diasAlugado = 1; // Mínimo de 1 diária

            // Calcula o valor total
            aluguel.ValorTotal = diasAlugado * aluguel.ValorDiaria;

            // Libera o veículo e atualiza sua quilometragem
            veiculo.Disponivel = true;
            veiculo.Quilometragem = quilometragemFinal;

            _context.Entry(aluguel).State = EntityState.Modified;
            _context.Entry(veiculo).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(aluguel);
        }


        // DELETE: api/Alugueis/5
        // Em um sistema real, aluguéis não seriam deletados, mas sim cancelados.
        // Manteremos o DELETE para cumprir o requisito de CRUD.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAluguel(int id)
        {
            var aluguel = await _context.Alugueis.Include(a => a.Veiculo).FirstOrDefaultAsync(a => a.Id == id);
            if (aluguel == null)
            {
                return NotFound();
            }

            // Se o aluguel for deletado sem ter sido concluído, o veículo deve voltar a ficar disponível
            if (!aluguel.DataDevolucaoReal.HasValue)
            {
                var veiculo = aluguel.Veiculo;
                veiculo.Disponivel = true;
                _context.Entry(veiculo).State = EntityState.Modified;
            }

            _context.Alugueis.Remove(aluguel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}