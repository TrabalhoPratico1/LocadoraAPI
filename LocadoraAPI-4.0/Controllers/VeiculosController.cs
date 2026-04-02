using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LocadoraAPI.Data;
using LocadoraAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LocadoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeiculosController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public VeiculosController(LocadoraContext context)
        {
            _context = context;
        }

        // GET: api/Veiculos
        // ATUALIZADO: Agora aceita parâmetros de filtro via Query String
        // Exemplo: GET /api/Veiculos?modelo=Onix&placa=ABC
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Veiculo>>> GetVeiculos([FromQuery] string? modelo, [FromQuery] string? placa)
        {
            // Transforma a tabela em uma consulta montável (AsQueryable)
            var query = _context.Veiculos
                .Include(v => v.Fabricante)
                .Include(v => v.Categoria)
                .AsQueryable();

            // Aplica o filtro de Modelo se foi informado
            if (!string.IsNullOrEmpty(modelo))
            {
                query = query.Where(v => v.Modelo.Contains(modelo));
            }

            // Aplica o filtro de Placa se foi informado
            if (!string.IsNullOrEmpty(placa))
            {
                query = query.Where(v => v.Placa.Contains(placa));
            }

            // Executa a consulta no banco
            return await query.ToListAsync();
        }

        // GET: api/Veiculos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Veiculo>> GetVeiculo(int id)
        {
            var veiculo = await _context.Veiculos.Include(v => v.Fabricante).Include(v => v.Categoria).FirstOrDefaultAsync(v => v.Id == id);

            if (veiculo == null)
            {
                return NotFound("Veículo não encontrado.");
            }

            return veiculo;
        }

        // POST: api/Veiculos
        [HttpPost]
        public async Task<ActionResult<Veiculo>> PostVeiculo(Veiculo veiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Veiculos.Add(veiculo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVeiculo), new { id = veiculo.Id }, veiculo);
        }

        // PUT: api/Veiculos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVeiculo(int id, Veiculo veiculo)
        {
            if (id != veiculo.Id)
            {
                return BadRequest("O ID do veículo na URL não corresponde ao do corpo da requisição.");
            }

            _context.Entry(veiculo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Veiculos.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Sucesso, sem conteúdo para retornar
        }

        // DELETE: api/Veiculos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVeiculo(int id)
        {
            var veiculo = await _context.Veiculos.FindAsync(id);
            if (veiculo == null)
            {
                return NotFound();
            }

            _context.Veiculos.Remove(veiculo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}