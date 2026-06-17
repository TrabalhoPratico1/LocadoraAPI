using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace LocadoraAPI.Models
{
    public class Cliente
    {
        public decimal Saldo { get; set; }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Nome { get; set; }

        [Required]
        [StringLength(11)]
        public string CPF { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public virtual ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    }
}