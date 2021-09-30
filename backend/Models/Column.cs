using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using prid_2021_g01.Models.DTO;

namespace prid_2021_g01.Models {
    public class Column : IValidatableObject {

        [Key]
        public int Id { get; set; }
        public string Title { get; set; }

        public int BoardId { get; set; }
        public virtual Board Board { get; set; }
        public int Pos { get; set; }

        public virtual IList<Card> Cards { get; set; } = new List<Card>();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            if (string.IsNullOrEmpty(Title)) {
                yield return new ValidationResult("Title is required", new[] { nameof(Title) });
            }
        }
    }
}