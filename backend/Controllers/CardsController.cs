using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PRID_Framework;
using prid_2021_g01.Models;
using prid_2021_g01.Models.DTO;
using prid_2021_g01.Helpers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using System.Security.Claims;


namespace prid_2021_g01.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase {
        private readonly Context _context;


        public CardsController(Context context) {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<CardDTO>>> GetAll(int id) {
            Column col = await _context.Columns.Where(c => c.Id == id).FirstOrDefaultAsync();
            if (col == null) {
                return NotFound();
            }
            return col.Cards.ToDTO();
        }

        [HttpPost]
        public async Task<ActionResult<CardDTO>> createCard(CardDTO data) {
            Column col = await _context.Columns.SingleOrDefaultAsync(c => c.Id == data.ColumnId);
            Card newCard = new Card() {
                OwnerId = data.OwnerId,
                Title = data.Title,
                Content = data.Content,
                ColumnId = data.ColumnId,
                Pos = col.Cards.Count(),
                LastUpdate = data.LastUpdate,
                CreateAt = data.CreateAt,
                Color = data.Color,
                FileUrl = data.FileUrl,
            };
            if (data.Collaborater != null) {
                var collab = data.Collaborater.Select(c => new Participate { UserId = c });

                foreach (var user in collab)
                    newCard.Collaborater.Add(user);
            }

           


            _context.Cards.Add(newCard);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) {
                return BadRequest(res);
            }

            return CreatedAtAction(nameof(GetOne), new { id = newCard.Id }, newCard.ToDTO());
        }


        [HttpGet("getOne/{id}")]
        public async Task<ActionResult<CardDTO>> GetOne(int id) {
            var card = await _context.Cards.SingleOrDefaultAsync(c => c.Id == id);
            if (card == null)
                return NotFound();
            return card.ToDTO();
        }



        [HttpPut("updatePos/{id}")]
        public async Task<IActionResult> UpdateCard(int id, CardDTO data) {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
                return NotFound();

            card.Pos = data.Pos;
            card.ColumnId = data.ColumnId;
            card.Title = data.Title;
            card.Content = data.Content;
            card.Color = data.Color;
            card.FileUrl = data.FileUrl;
            card.LastUpdate = data.LastUpdate;


            // on supprime
            var partDTO = data.Collaborater.Select(x => x); // get userID
            foreach (var uid in card.Collaborater) {
                if (!partDTO.Contains(uid.Participant.Id))
                    _context.Participates.Remove(uid);
            }




            // on ajoute
            var collab = card.Collaborater.Select(x => x.UserId);
            foreach (var user in data.Collaborater) {
                if (!collab.Contains(user)) {
                    var newColab = new Participate { UserId = user };
                    card.Collaborater.Add(newColab);
                }
            }




            _context.Cards.Update(card);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) {
                return BadRequest(res);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> delete(int id) {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
                return NotFound();

            _context.Cards.Remove(card);
            _context.SaveChanges();

            return NoContent();

        }


    }
}