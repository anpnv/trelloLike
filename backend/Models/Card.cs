using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using prid_2021_g01.Models.DTO;

namespace prid_2021_g01.Models {
    public class Card : IValidatableObject {

        [Key]
        public int Id { get; set; }

        public int OwnerId { get; set; }
        public virtual User Owner { get; set; }
        public int Pos { get; set; }

        public int ColumnId { get; set; }
        public virtual Column Column { get; set; }


        public string Title { get; set; }
        public string Content { get; set; }

        public string CreateAt { get; set; }
        public string LastUpdate { get; set; }

        public string Color { get; set; }

        public string FileUrl { get; set; }


        public virtual IList<Participate> Collaborater { get; set; } = new List<Participate>();


        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            if (string.IsNullOrEmpty(Title)) {
                yield return new ValidationResult("Title is required", new[] { nameof(Title) });
            }
        }

    }
}