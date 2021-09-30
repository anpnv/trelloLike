using System;
using System.Collections.Generic;


namespace prid_2021_g01.Models.DTO {
    public class BoardDTO {
        public int Id { get; set; }
        public string Title { get; set; }
        public int OwnerId { get; set; }

        public IEnumerable<ActivityDTO> Activities { get; set; }
        public IEnumerable<ColumnDTO> Columns { get; set; }
        public IEnumerable<int> Collaborater { get; set; }

    }
}