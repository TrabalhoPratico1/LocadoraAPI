namespace LocadoraAPI.DTOs
{
    public class ClienteCreateDTO
    {
        public string Nome { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public decimal Saldo { get; set; }
    }
}