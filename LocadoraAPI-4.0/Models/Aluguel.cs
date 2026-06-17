using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace LocadoraAPI.Models
{
    public class Aluguel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        public DateTime? DataDevolucaoReal { get; set; }

        [Required]
        public int QuilometragemInicial { get; set; }

        public int? QuilometragemFinal { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDiaria { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ValorTotal { get; set; }

        [ForeignKey("Cliente")]
        public int ClienteId { get; set; }

        [ValidateNever]
        public virtual Cliente? Cliente { get; set; }

        [ForeignKey("Veiculo")]
        public int VeiculoId { get; set; }

        [ValidateNever]
        public virtual Veiculo? Veiculo { get; set; }
    }
}