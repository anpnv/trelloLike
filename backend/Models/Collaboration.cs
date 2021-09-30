using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using prid_2021_g01.Models.DTO;


namespace prid_2021_g01.Models {
    public class Collaboration {


        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User Participant { get; set; }

        public int BoardId { get; set; }
        public virtual Board Board { get; set; }

    }
}