using System;
using Microsoft.EntityFrameworkCore;

namespace prid_2021_g01.Models {
    public class Context : DbContext {

        public DbSet<User> Users { get; set; }
        public DbSet<Board> Boards { get; set; }
        public DbSet<Collaboration> Collaborations { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Column> Columns { get; set; }
        public DbSet<Participate> Participates { get; set; }
        public DbSet<Activity> Activites { get; set; }




        public Context(DbContextOptions<Context> options)
            : base(options) {

                
        }




        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>().HasData(
                    new User() { Id = 1, Pseudo = "ben", Password = "ben", FirstName = "Benoît", LastName="Penelle", Email = "ben@pen.com" , Role = Role.Admin},
                    new User() { Id = 2, Pseudo = "bruno", Password = "bruno", FirstName = "Bruno", LastName = "Lacroix", Email = "brun@lac.com" , Role = Role.Admin },
                    new User() { Id = 3, Pseudo = "admin", Password = "admin", FirstName = "admin", LastName = "admin", Email = "admin@admin.com", Role = Role.Admin },
                    new User() { Id = 4, Pseudo = "andrei", Password = "andrei", FirstName = "Andrei", LastName = "Ponamarev", Email = "andrei@a.com" },
                    new User() { Id = 5, Pseudo = "cesar", Password = "cesar", FirstName = "Cesar", LastName = "Fontaine", Email = "cesar@a.com" },
                    new User() { Id = 6, Pseudo = "jean", Password = "user", FirstName = "Jean", LastName = "Chateau", Email = "user@1.com" },
                    new User() { Id = 7, Pseudo = "paul", Password = "user", FirstName = "Paul", LastName = "Champ", Email = "user2@2.com" },
                    new User() { Id = 8, Pseudo = "isa", Password = "user", FirstName = "Isa", LastName = "Belle", Email = "user@3.com" },
                    new User() { Id = 9, Pseudo = "mat", Password = "user", FirstName = "Mat", LastName = "Thieu", Email = "user2@4.com" }
            );

            modelBuilder
                .Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder
                .Entity<User>()
                .HasIndex(u => u.Pseudo)
                .IsUnique();

            modelBuilder
                .Entity<Board>()
                .HasOne(b => b.Owner)
                .WithMany(u => u.Boards);

            modelBuilder
                .Entity<Card>()
                .HasOne(c => c.Owner)
                .WithMany(u => u.Cards);

            modelBuilder
                .Entity<Card>()
                .HasOne(c => c.Column)
                .WithMany(co => co.Cards);

            modelBuilder
                .Entity<Column>()
                .HasOne(b => b.Board)
                .WithMany(c => c.Columns);

            modelBuilder
                .Entity<Activity>()
                .HasOne(b => b.Board)
                .WithMany(a => a.Activities);

            modelBuilder
                .Entity<Collaboration>()
                .HasOne<User>(u => u.Participant)
                .WithMany(b => b.BoardParticipations)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder
                .Entity<Collaboration>()
                .HasOne<Board>(b => b.Board)
                .WithMany(u => u.Collaborater)
                .HasForeignKey(b => b.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder
                .Entity<Participate>()
                .HasOne<User>(u => u.Participant)
                .WithMany(c => c.CardParticipations)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder
                .Entity<Participate>()
                .HasOne<Card>(c => c.Card)
                .WithMany(u => u.Collaborater)
                .HasForeignKey(c => c.CardId)
                .OnDelete(DeleteBehavior.Cascade);


        }
    }


}