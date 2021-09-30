using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;



namespace prid_2021_g01.Models {
    public class Activity {

        [Key]
        public int Id { get; set; }
        public int BoardId { get; set; }
        public virtual Board Board { get; set; }
        public string Author { get; set; }
        public string ActionDetails { get; set; }
        public string Time { get; set; }


    }
}