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
    public class ColumnsController : ControllerBase {
        private readonly Context _context;


        public ColumnsController(Context context) {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<ColumnDTO>>> GetAll(int id) {
            Board board = await _context.Boards.Where(b => b.Id == id).FirstOrDefaultAsync();
            if (board == null) {
                return NotFound();
            }
            return board.Columns.ToDTO();
        }

        [HttpPost]
        public async Task<ActionResult<ColumnDTO>> create(ColumnDTO data) {
            Board board = await _context.Boards.SingleOrDefaultAsync(b => b.Id == data.BoardId);
            Column newCol = new Column() {
                BoardId = data.BoardId,
                Title = data.Title,
                Pos = board.Columns.Count()
            };

            _context.Columns.Add(newCol);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) {
                return BadRequest(res);
            }

            return CreatedAtAction(nameof(GetOne), new { id = newCol.Id }, newCol.ToDTO());
        }


        [HttpGet("getOne/{id}")]
        public async Task<ActionResult<ColumnDTO>> GetOne(int id) {
            var col = await _context.Columns.SingleOrDefaultAsync(c => c.Id == id);
            if (col == null)
                return NotFound();
            return col.ToDTO();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ColumnDTO>> update(int id, ColumnDTO data) {

            var col = await _context.Columns.FindAsync(id);
            if (col == null) {
                return NotFound();
            }

            col.Title = data.Title;
            col.Pos = data.Pos;

            var cardsDto = data.Cards.Where(c => c.ColumnId == col.Id).Select(c => c.Id);
            foreach (var card in col.Cards) {
                if (!cardsDto.Contains(card.Id)) {
                    _context.Remove(card);
                }
            }

            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> delete(int id) {
            var col = await _context.Columns.FindAsync(id);
            if (col == null)
                return NotFound();

            _context.Columns.Remove(col);
            _context.SaveChanges();

            return NoContent();

        }

        /* [HttpPut("updatePos/{id}")]
        public async Task<IActionResult> UpdateCol(int id, ColumnDTO data) {
            var col = await _context.Columns.FindAsync(id);
            if (col == null)
                return NotFound();

            col.Pos = data.Pos;
            col.Title = data.Title;
            col.BoardId = data.BoardId;

            col.Cards = data.Cards;
        }
        */

    }
}