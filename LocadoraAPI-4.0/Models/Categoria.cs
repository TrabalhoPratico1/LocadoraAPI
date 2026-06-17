using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

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

        public virtual ICollection<Veiculo> Veiculos { get; set; }
            = new List<Veiculo>();
    }
}