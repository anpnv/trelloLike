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
    public class ActivitiesController : ControllerBase {
        private readonly Context _context;

        public ActivitiesController(Context context) {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<ActivityDTO>>> GetAll(int id) {
            Board board = await _context.Boards.Where(b => b.Id == id).FirstOrDefaultAsync();
            if (board == null) {
                return NotFound();
            }
            
            return board.Activities.ToDTO();
        }

        [HttpPost]
        public async Task<ActionResult<ActivityDTO>> create(ActivityDTO data) {
            Board board = await _context.Boards.SingleOrDefaultAsync(b => b.Id == data.BoardId);
            Activity newAct = new Activity() {
                BoardId = data.BoardId,
                Author = data.Author,
                ActionDetails = data.ActionDetails,
                Time = data.Time
            };
            _context.Activites.Add(newAct);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) {
                return BadRequest(res);
            }
            return CreatedAtAction(nameof(GetOne), new { id = newAct.Id }, newAct.ToDTO());
        }

        [HttpGet("getOne/{id}")]
        public async Task<ActionResult<ActivityDTO>> GetOne(int id) {
            var act = await _context.Activites.SingleOrDefaultAsync(a => a.Id == id);
            if (act == null)
                return NotFound();
            return act.ToDTO();
        }
    }
}
