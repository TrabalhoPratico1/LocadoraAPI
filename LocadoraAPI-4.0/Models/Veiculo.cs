using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LocadoraAPI.Models
{
    public class Veiculo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Modelo { get; set; }

        [Required]
        public int AnoFabricacao { get; set; }

        [Required]
        [StringLength(8)]
        public string Placa { get; set; }

        [Required]
        public int Quilometragem { get; set; }

        public bool Disponivel { get; set; } = true;

        [ForeignKey("Fabricante")]
        public int FabricanteId { get; set; }

        [JsonIgnore]
       public virtual Fabricante? Fabricante { get; set; }

        [ForeignKey("Categoria")]
        public int CategoriaId { get; set; }

        [JsonIgnore]
        public virtual Categoria? Categoria { get; set; }
    }
}