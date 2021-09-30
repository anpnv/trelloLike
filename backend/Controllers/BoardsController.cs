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
    public class BoardsController : ControllerBase {
        private readonly Context _context;


        public BoardsController(Context context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BoardDTO>>> GetAll() {
            return (await _context.Boards.ToListAsync()).ToDTO();
        }




        [HttpGet("myBoard/{id}")]
        public async Task<ActionResult<IEnumerable<BoardDTO>>> getMyBoard(int id) {
            User user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();

            return user.Boards.ToDTO();


        }



        [HttpGet("{id}")]
        public async Task<ActionResult<BoardDTO>> GetOne(int id) {
            var board = await _context.Boards.SingleOrDefaultAsync(b => b.Id == id);
            if (board == null)
                return NotFound();
            return board.ToDTO();
        }

        [HttpPost]
        public async Task<ActionResult<BoardDTO>> createBoard(BoardDTO data) {

            Board newBoard = new Board() {
                Title = data.Title,
                OwnerId = data.OwnerId,
            };


            if (data.Collaborater != null) {
                var collab = data.Collaborater.Select(part => new Collaboration { UserId = part });

                foreach (var user in collab)
                    newBoard.Collaborater.Add(user);
            }
            _context.Boards.Add(newBoard);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) {
                return BadRequest(res);
            }


            return CreatedAtAction(nameof(GetOne), new { id = newBoard.Id }, newBoard.ToDTO());
        }





        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBoard(int id, BoardDTO data) {
            var board = await _context.Boards.FindAsync(id);
            if (board == null)
                return NotFound();


            board.Title = data.Title;



            // delete
            var partDTO = data.Collaborater.Select(x => x);
            foreach (var uid in board.Collaborater) {
                if (!partDTO.Contains(uid.Participant.Id))
                    _context.Collaborations.Remove(uid);
            }


            // add 
            var part = board.Collaborater.Select(x => x.UserId);
            foreach (var u in data.Collaborater) {
                {
                    if (!part.Contains(u)) {
                        var newPart = new Collaboration { UserId = u };
                        board.Collaborater.Add(newPart);
                    }
                }
            }




            _context.Boards.Update(board);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) {
                return BadRequest(res);
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoard(int id) {
            var board = await _context.Boards.FindAsync(id);
            if (board == null)
                return NotFound();
            _context.Boards.Remove(board);
            _context.SaveChanges();
            return NoContent();
        }


    }
}