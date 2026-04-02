using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LocadoraAPI.Data;
using LocadoraAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LocadoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public RelatoriosController(LocadoraContext context)
        {
            _context = context;
        }

        // Filtro 1: Veículos por nome do fabricante (JOIN Veiculo e Fabricante)
        [HttpGet("veiculos-por-fabricante")]
        public async Task<ActionResult<IEnumerable<Veiculo>>> GetVeiculosPorFabricante([FromQuery] string nomeFabricante)
        {
            var veiculos = await _context.Veiculos
                .Include(v => v.Fabricante) // JOIN com Fabricante
                .Where(v => v.Fabricante.Nome.Contains(nomeFabricante))
                .ToListAsync();

            return Ok(veiculos);
        }

        // Filtro 2: Aluguéis ativos (não devolvidos) com detalhes do cliente e veículo (JOIN Aluguel, Cliente, Veiculo)
        [HttpGet("alugueis-ativos")]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetAlugueisAtivos()
        {
            var alugueis = await _context.Alugueis
                .Include(a => a.Cliente)   // JOIN com Cliente
                .Include(a => a.Veiculo)   // JOIN com Veiculo
                .Where(a => a.DataDevolucaoReal == null)
                .ToListAsync();

            return Ok(alugueis);
        }

        // Filtro 3: Histórico de aluguéis de um cliente específico pelo CPF (JOIN Aluguel e Cliente)
        [HttpGet("historico-cliente/{cpf}")]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetHistoricoCliente(string cpf)
        {
            var alugueis = await _context.Alugueis
                .Include(a => a.Veiculo) // JOIN com Veiculo para mostrar qual carro foi alugado
                .Include(a => a.Cliente) // JOIN com Cliente para filtrar pelo CPF
                .Where(a => a.Cliente.CPF == cpf)
                .OrderByDescending(a => a.DataInicio)
                .ToListAsync();

            if (!alugueis.Any())
            {
                return NotFound($"Nenhum aluguel encontrado para o CPF: {cpf}");
            }

            return Ok(alugueis);
        }

        // Filtro 4: Veículos de uma categoria específica que estão disponíveis (JOIN Veiculo e Categoria)
        [HttpGet("veiculos-disponiveis-por-categoria")]
        public async Task<ActionResult<IEnumerable<Veiculo>>> GetVeiculosDisponiveisPorCategoria([FromQuery] string nomeCategoria)
        {
            var veiculos = await _context.Veiculos
                .Include(v => v.Categoria) // JOIN com Categoria
                .Include(v => v.Fabricante)
                .Where(v => v.Categoria.Nome.ToLower() == nomeCategoria.ToLower() && v.Disponivel)
                .ToListAsync();

            return Ok(veiculos);
        }

        // Filtro 5: Faturamento total por cliente (JOIN Aluguel e Cliente, com agregação)
        [HttpGet("faturamento-por-cliente")]
        public async Task<ActionResult> GetFaturamentoPorCliente()
        {
            var faturamento = await _context.Alugueis
                .Where(a => a.ValorTotal.HasValue) // Apenas aluguéis finalizados
                .GroupBy(a => new { a.ClienteId, a.Cliente.Nome }) // JOIN implícito com Cliente
                .Select(g => new
                {
                    ClienteNome = g.Key.Nome,
                    FaturamentoTotal = g.Sum(a => a.ValorTotal)
                })
                .OrderByDescending(r => r.FaturamentoTotal)
                .ToListAsync();

            return Ok(faturamento);
        }
    }
}
