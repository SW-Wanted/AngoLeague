using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AngoLeague.Shared.Models
{
    public class Game
    {
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Id { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        public Team TeamHome { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        public Team TeamAway { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        public DateTime MatchDate { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        [StringLength(10, ErrorMessage = "Máximo de 100 caracteres")]
        public string Location { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        public GameStyle Style { get; set; }

        public string GameStyleDescription
        {
            get
            {
                return Style switch
                {
                    GameStyle.Friendly => "Jogo Amistoso",
                    GameStyle.Tournament => "Torneio",
                    GameStyle.Bet => "Jogo de Aposta",
                    _ => "Estilo de Jogo Desconhecido"
                };
            }
        }
    }

    public enum GameStyle
    {
        Friendly,
        Bet,
        Tournament
    }
}
