using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
namespace LocadoraAPI.Models
{
    public class Aluguel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        public DateTime? DataDevolucaoReal { get; set; } // Nullable, pois o carro pode não ter sido devolvido ainda

        [Required]
        public int QuilometragemInicial { get; set; }

        public int? QuilometragemFinal { get; set; } // Nullable

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDiaria { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ValorTotal { get; set; } // Nullable, calculado na devolução

        // Chave estrangeira para Cliente
        [ForeignKey("Cliente")]
        public int ClienteId { get; set; }
        public virtual Cliente Cliente { get; set; }

        // Chave estrangeira para Veiculo
        [ForeignKey("Veiculo")]
        public int VeiculoId { get; set; }
        public virtual Veiculo Veiculo { get; set; }
    }
}
