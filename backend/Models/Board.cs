using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using prid_2021_g01.Models.DTO;

namespace prid_2021_g01.Models {
    public class Board : IValidatableObject {

        [Key]
        public int Id { get; set; }
        public string Title { get; set; }

        // 1- N user.cs 46
        public int OwnerId { get; set; }
        public virtual User Owner { get; set; }



        public virtual IList<Collaboration> Collaborater { get; set; } = new List<Collaboration>();
        public virtual IList<Activity> Activities { get; set; } = new List<Activity>();

        public virtual IList<Column> Columns { get; set; } = new List<Column>();


        public IEnumerable<int> Participants {
            get => Collaborater.Select(u => u.UserId);
        }



        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            if (string.IsNullOrEmpty(Title)) {
                yield return new ValidationResult("Title is required", new[] { nameof(Title) });
            }
        }
    }
}