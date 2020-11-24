using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Web.Http.Cors;

namespace backend.Controllers
{
    [Authorize(Roles = UserRoles.Admin)]
    [Route("[controller]")]
    [ApiController]
    [EnableCors(origins: "http://localhost:4200", headers: "", methods: "")]
    public class UsersController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly UserManager<User> usermanager;

        public UsersController(UserManager<User> usermanager,UserDbContext context)
        {
            _context = context;
            this.usermanager = usermanager;
        }

        // GET: api/Users
        [HttpGet]
        public ActionResult<IEnumerable<ReturnUserDto>> GetUsers()
        {
            var userlist = new List<ReturnUserDto>();
            foreach (User usr in _context.Users)
            {
                userlist.Add(new ReturnUserDto(usr));
            }
            return userlist;
        }


        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await usermanager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await usermanager.DeleteAsync(user);
            return Ok();
        }
    }
}
