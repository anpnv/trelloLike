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
    public class UsersController : ControllerBase {
        private readonly Context _context;

        public UsersController(Context context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
            return (await _context.Users.ToListAsync()).ToDTO();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetOne(int id) {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound();
            return user.ToDTO();
        }





        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO data) {
            var newUser = new User() {
                Pseudo = data.Pseudo,
                Password = data.Password,
                FirstName = data.FirstName,
                LastName = data.LastName,
                BirthDate = data.BirthDate,
                Email = data.Email,
                Role = data.Role,
            };

            if (data.CardParticipations != null) {
                var cpart = data.CardParticipations.Select(u => new Participate { CardId = u.Id });
                foreach (var user in cpart) {
                    newUser.CardParticipations.Add(user);
                }
            }

            if (data.BoardParticipations != null) {
                var bpart = data.BoardParticipations.Select(u => new Collaboration { BoardId = u.Id });

                foreach (var user in bpart) {
                    newUser.BoardParticipations.Add(user);
                }
            }


            _context.Users.Add(newUser);

            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetOne), new { id = newUser.Id }, newUser.ToDTO());
        }

        [Authorized(Role.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDTO userDto) {

            var newUser = await _context.Users.FindAsync(id);
            if (newUser == null)
                return NotFound();


            if (userDto.Password != null)
                newUser.Password = userDto.Password;

            newUser.Pseudo = userDto.Pseudo;
            newUser.Email = userDto.Email;
            newUser.LastName = userDto.LastName;
            newUser.FirstName = userDto.FirstName;
            newUser.BirthDate = userDto.BirthDate;
            newUser.Role = userDto.Role;



            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            if (User.Identity.Name == newUser.Pseudo) {
                return Ok(newUser.ToDTO());
            }

            return NoContent();
        }

        [Authorized(Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id) {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();

            return NoContent();
        }



        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<ActionResult<User>> Authenticate(UserDTO data) {
            var member = await Authenticate(data.Pseudo, data.Password);
            if (member == null)
                return BadRequest(new ValidationErrors().Add("Member not found", "Pseudo"));
            if (member.Token == null)
                return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));
            return Ok(member);




        }

        private async Task<User> Authenticate(string pseudo, string password) {
            var member = await _context.Users.FirstOrDefaultAsync(user => user.Pseudo == pseudo);

            // return null if member not found
            if (member == null)
                return null;

            if (member.Password == password) {
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-super-secret-key");
                var tokenDescriptor = new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity(new Claim[]
                                                 {
                                             new Claim(ClaimTypes.Name, member.Pseudo),
                                             new Claim(ClaimTypes.Role, member.Role.ToString())
                                                 }),
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(60),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                member.Token = tokenHandler.WriteToken(token);
            }
            member.Password = null;

            return member;
        }


        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserDTO data) {
            return await PostUser(data);
        }



        [AllowAnonymous]
        [HttpGet("available/pseudo/{pseudo}")]
        public async Task<ActionResult<bool>> IsAvailablePseudo(string pseudo) {
            if (string.IsNullOrEmpty(pseudo)) {
                return BadRequest(new ValidationErrors().Add("Empty field", "Pseudo"));
            }
            return Ok(!await _context.Users.AnyAsync(u => u.Pseudo == pseudo));
        }


        [AllowAnonymous]
        [HttpGet("available/email/{email}")]
        public async Task<ActionResult<bool>> IsAvailableEmail(string email) {
            if (string.IsNullOrEmpty(email)) {
                return BadRequest(new ValidationErrors().Add("Empty filed", "Email"));
            }
            return Ok(!await _context.Users.AnyAsync(u => u.Email == email));
        }



    }
}