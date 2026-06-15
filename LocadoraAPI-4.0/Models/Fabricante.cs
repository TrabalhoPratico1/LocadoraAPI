using System.ComponentModel.DataAnnotations;
namespace LocadoraAPI.Models
using System.Collections.Generic;
{
    public class Fabricante
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }
        public virtual ICollection<Veiculo> Veiculos { get; set; }
        public Fabricante()
        {
            Veiculos = new HashSet<Veiculo>();
        }
    }
}