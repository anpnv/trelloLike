using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;

public enum Role {
    Admin = 2, Manager = 1, Member = 0
}

namespace prid_2021_g01.Models {
    public class User : IValidatableObject {

        [Key]
        public int Id { get; set; }
        [Required, StringLength(10, MinimumLength = 3), RegularExpression("^[a-zA-Z][a-zA-Z0-9_]{2,9}$")]
        public string Pseudo { get; set; }
        [Required, StringLength(10, MinimumLength = 3)]
        public string Password { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }


        [StringLength(50, MinimumLength = 3)]
        public string LastName { get; set; }
        [StringLength(50, MinimumLength = 3)]
        public string FirstName { get; set; }
        public DateTime? BirthDate { get; set; }
        public int? Age {
            get {
                if (!BirthDate.HasValue)
                    return null;
                var today = DateTime.Today;
                var age = today.Year - BirthDate.Value.Year;
                if (BirthDate.Value.Date > today.AddYears(-age)) age--;
                return age;
            }
        }

        public Role Role { get; set; } = Role.Member;
        [NotMapped]
        public string Token { get; set; }


        public virtual IList<Card> Cards { get; set; } = new List<Card>();
        public virtual IList<Board> Boards { get; set; } = new List<Board>();



        public virtual IList<Collaboration> BoardParticipations { get; set; } = new List<Collaboration>();
        public virtual IList<Participate> CardParticipations { get; set; } = new List<Participate>();


  




        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(DbContext)) as Context;
            Debug.Assert(currContext != null);

            // validation
            if (currContext.Users.Any(u => u.Pseudo == Pseudo && u.Id != Id))
                yield return new ValidationResult("Pseudo is already taken", new[] { nameof(Pseudo) });
            else if (currContext.Users.Any(u => u.Email == Email && u.Id != Id))
                yield return new ValidationResult("Email is already taken", new[] { nameof(Email) });

            if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
                yield return new ValidationResult("Can't be born later than today", new[] { nameof(BirthDate) });
            else if (Age.HasValue && Age < 18)
                yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });

            if (!string.IsNullOrWhiteSpace(FirstName) && string.IsNullOrWhiteSpace(LastName))
                yield return new ValidationResult("LastName have to be defined", new[] { nameof(LastName) });

            if (string.IsNullOrWhiteSpace(FirstName) && !string.IsNullOrWhiteSpace(LastName))
                yield return new ValidationResult("FirstName have to be defined", new[] { nameof(FirstName) });
        }


    }
}