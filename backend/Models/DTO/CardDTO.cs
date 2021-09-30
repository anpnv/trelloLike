using System;
using System.Collections.Generic;


namespace prid_2021_g01.Models.DTO {
    public class CardDTO {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int OwnerId { get; set; }
        public int ColumnId { get; set; }
        public int Pos { get; set; }

        public string CreateAt { get; set; }
        public string LastUpdate { get; set; }

        public string Color { get; set; }

        public string FileUrl { get; set; }

        public IEnumerable<int> Collaborater { get; set; }

        public IEnumerable<TagDTO> Tags { get; set; }


    }
}