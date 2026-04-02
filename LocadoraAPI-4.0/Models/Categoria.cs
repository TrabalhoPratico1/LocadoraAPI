using System.ComponentModel.DataAnnotations;
namespace LocadoraAPI.Models
{
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Nome { get; set; }

        [StringLength(200)]
        public string Descricao { get; set; }

        // Navigation property: Uma categoria pode ter vários veículos
        public virtual ICollection<Veiculo> Veiculos { get; set; }
    }
}
