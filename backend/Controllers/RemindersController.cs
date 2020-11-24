using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using backend.Authentication;
using Microsoft.AspNetCore.Identity;
using System.Web.Http.Cors;

namespace backend.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class RemindersController : ControllerBase
    {
        private readonly ReminderContext _context;
        UserManager<User> usermanager;

        public RemindersController(ReminderContext context, UserManager<User> usermanager)
        {
            _context = context;
            this.usermanager = usermanager;
        }

        // GET: api/Reminders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reminder>>> GetReminders()
        {
            var user = await usermanager.FindByNameAsync(User.Identity.Name);
            var reminderlist = new List<Reminder>();
            foreach (Reminder rmd in _context.Reminders)
            {
                if(rmd.UserId == user.Id)
                    reminderlist.Add(rmd);
            }
            return reminderlist;
        }

        // GET: api/Reminders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reminder>> GetReminder(long id)
        {
            var reminder = await _context.Reminders.FindAsync(id);

            if (reminder == null)
            {
                return NotFound();
            }

            return reminder;
        }

        // PUT: api/Reminders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReminder(long id, Reminder reminder)
        {
            if (id != reminder.Id)
            {
                return BadRequest();
            } 

            _context.Entry(reminder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReminderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Reminders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Reminder>> PostReminder(Reminder reminder)
        {
            var user = await usermanager.FindByNameAsync(User.Identity.Name);
            reminder.UserId = user.Id;
            _context.Reminders.Add(reminder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReminder), new { id = reminder.Id }, reminder);
        }

        // DELETE: api/Reminders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReminder(long id)
        {
            var reminder = await _context.Reminders.FindAsync(id);
            if (reminder == null)
            {
                return NotFound();
            }

            _context.Reminders.Remove(reminder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReminderExists(long id)
        {
            return _context.Reminders.Any(e => e.Id == id);
        }
    }
}
