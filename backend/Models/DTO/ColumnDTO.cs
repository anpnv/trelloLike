using System;
using System.Collections.Generic;


namespace prid_2021_g01.Models.DTO {
    public class ColumnDTO {
        public int Id { get; set; }
        public string Title { get; set; }
        public int BoardId { get; set; }
        public int Pos { get; set; }

        public IEnumerable<CardDTO> Cards { get; set; }

    }
}