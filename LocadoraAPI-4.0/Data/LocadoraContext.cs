using LocadoraAPI.Models;
using Microsoft.EntityFrameworkCore;
namespace LocadoraAPI.Data

{
    public class LocadoraContext : DbContext
    {
        public LocadoraContext(DbContextOptions<LocadoraContext> options) : base(options) { }

        public DbSet<Fabricante> Fabricantes { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Veiculo> Veiculos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Aluguel> Alugueis { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>().HasIndex(c => c.CPF).IsUnique();
            modelBuilder.Entity<Veiculo>().HasIndex(v => v.Placa).IsUnique();
        }
    }
}
