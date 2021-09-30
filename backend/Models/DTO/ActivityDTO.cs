using System;
using System.Collections.Generic;


namespace prid_2021_g01.Models.DTO {
    public class ActivityDTO {
        public int Id { get; set; }
        public int BoardId { get; set; }
        public string Author { get; set; }
        public string ActionDetails { get; set; }
        public string Time { get; set; }
    }
}