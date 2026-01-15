namespace GestaoEscolarAPI
{
    public class Aluno
    {
        public string name { get; set; } = string.Empty;
        public List<double> grades { get; set; } = new List<double>();
        public double frequency { get; set; }
    }
}
