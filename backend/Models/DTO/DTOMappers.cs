using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using prid_2021_g01.Models.DTO;

namespace prid_2021_g01.Models.DTO {
    public static class DTOMappers {
        /*
            Users
        */
        public static UserDTO ToDTO(this User user) {
            return new UserDTO {
                Id = user.Id,
                Pseudo = user.Pseudo,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                Email = user.Email,
                Role = user.Role,
                Boards = user.Boards.ToDTO(),
                BoardParticipations = user.BoardParticipations.Select(b => b.Board).ToDTO(),
                CardParticipations = user.CardParticipations.Select(c => c.Card).ToDTO()
            };
        }

        public static List<UserDTO> ToDTO(this IEnumerable<User> users) {
            return users.Select(m => m.ToDTO()).ToList();
        }

        public static BoardDTO ToDTO(this Board board) {
            return new BoardDTO {
                Id = board.Id,
                Title = board.Title,
                OwnerId = board.OwnerId,
                Columns = board.Columns.ToDTO(),
                Collaborater = board.Collaborater.Select(u => u.UserId).ToList(),
                Activities = board.Activities.ToDTO()
            };
        }

        public static List<BoardDTO> ToDTO(this IEnumerable<Board> boards) {
            return boards.Select(b => b.ToDTO()).ToList();
        }


        //column

        public static ColumnDTO ToDTO(this Column column) {
            return new ColumnDTO {
                Id = column.Id,
                Title = column.Title,
                Pos = column.Pos,
                BoardId = column.BoardId,
                Cards = column.Cards.ToDTO(),
            };
        }

        public static List<ColumnDTO> ToDTO(this IEnumerable<Column> columns) {
            List<ColumnDTO> ordered = columns.Select(c => c.ToDTO()).ToList();
            return ordered.OrderBy(col => col.Pos).ToList();
        }

        //card
        public static CardDTO ToDTO(this Card card) {
            return new CardDTO {
                Id = card.Id,
                Title = card.Title,
                Content = card.Content,
                OwnerId = card.OwnerId,
                Pos = card.Pos,
                ColumnId = card.ColumnId,
                Collaborater = card.Collaborater.Select(u => u.UserId).ToList(),
                Color = card.Color,
                CreateAt = card.CreateAt,
                LastUpdate = card.LastUpdate,
                FileUrl = card.FileUrl

            };
        }

        public static List<CardDTO> ToDTO(this IEnumerable<Card> cards) {
            List<CardDTO> ordered = cards.Select(c => c.ToDTO()).ToList();
            return ordered.OrderBy(card => card.Pos).ToList();
        }


        // activity
        public static ActivityDTO ToDTO(this Activity activity) {
            return new ActivityDTO {
                Id = activity.Id,
                BoardId = activity.BoardId,
                Author = activity.Author,
                ActionDetails = activity.ActionDetails,
                Time = activity.Time
            };
        }

        public static List<ActivityDTO> ToDTO(this IEnumerable<Activity> activities) {
            List<ActivityDTO> ordered = activities.Select(a => a.ToDTO()).ToList();
            return ordered.OrderByDescending(act => (act.Time)).ToList();
        }


    }

}
