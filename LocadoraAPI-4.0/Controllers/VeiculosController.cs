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

        
        [HttpGet]
public async Task<IActionResult> GetVeiculos()
{
    var veiculos = await _context.Veiculos
        .Include(v => v.Fabricante)
        .Include(v => v.Categoria)
        .Select(v => new
        {
            v.Id,
            v.Modelo,
            v.AnoFabricacao,
            v.Placa,
            v.Quilometragem,
            v.Disponivel,
            v.FabricanteId,
            v.CategoriaId,

            Fabricante = new
            {
                v.Fabricante.Id,
                v.Fabricante.Nome
            },

            Categoria = new
            {
                v.Categoria.Id,
                v.Categoria.Nome
            }
        })
        .ToListAsync();

    return Ok(veiculos);
}

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

        
       [HttpPost]
public async Task<ActionResult<Veiculo>> PostVeiculo(Veiculo veiculo)
{
    var fabricante =
        await _context.Fabricantes.FindAsync(veiculo.FabricanteId);

    if (fabricante == null)
        return BadRequest("Fabricante inválido.");

    var categoria =
        await _context.Categorias.FindAsync(veiculo.CategoriaId);

    if (categoria == null)
        return BadRequest("Categoria inválida.");

    _context.Veiculos.Add(veiculo);

    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetVeiculo),
        new { id = veiculo.Id }, veiculo);
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

            return NoContent(); 
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