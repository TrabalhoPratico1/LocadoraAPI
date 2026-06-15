using System.ComponentModel.DataAnnotations;
namespace LocadoraAPI.Models
using System.Collections.Generic;
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

        // Navigation property: Um cliente pode ter vários aluguéis
        public virtual ICollection<Aluguel> Alugueis { get; set; }
    }
}
