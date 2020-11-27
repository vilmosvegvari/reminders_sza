using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using backend.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Cors;

namespace backend.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
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
        [EnableCors("CorsPolicy")]
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

        [EnableCors("CorsPolicy")]
        [HttpGet("web")]
        public async Task<ActionResult<IEnumerable<Reminder>>> GetWebReminders()
        {
            var user = await usermanager.FindByNameAsync(User.Identity.Name);

            if (user == null)
                return BadRequest();

            var reminderlist = new List<Reminder>();
            foreach (Reminder rmd in _context.Reminders)
            {
                if (rmd.UserId == user.Id && rmd.Notification == "web" && !rmd.NotificationSent)
                    reminderlist.Add(rmd);
            }
            return reminderlist;
        }

        // GET: api/Reminders/5
        [EnableCors("CorsPolicy")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Reminder>> GetReminder(long id)
        {
            var reminder = await _context.Reminders.FindAsync(id);
            var user = await usermanager.FindByNameAsync(User.Identity.Name);

            if (user == null || reminder.UserId != user.Id)
                return BadRequest();

            if (reminder == null)
            {
                return NotFound();
            }

            return reminder;
        }

        // PUT: api/Reminders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableCors("CorsPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReminder(long id, UpdateReminderDto rmd)
        {
            if (!ReminderExists(id))
            {
                return BadRequest();
            }
            var reminder = await _context.Reminders.FindAsync(id);
            reminder.Name = rmd.Name;
            reminder.Deadline = rmd.Deadline;
            reminder.Description = rmd.Description;
            reminder.Notification = rmd.Notification;
            reminder.Creation = rmd.Creation;
            reminder.NotificationSent = false;
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

            return Ok();
        }

        // POST: api/Reminders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableCors("CorsPolicy")]
        [HttpPost]
        public async Task<ActionResult<Reminder>> PostReminder(Reminder reminder)
        {
            var user = await usermanager.FindByNameAsync(User.Identity.Name);
            if (user != null)
            {
                reminder.UserId = user.Id;
                reminder.NotificationSent = false;
                _context.Reminders.Add(reminder);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReminder), new { id = reminder.Id }, reminder);
            }
            return BadRequest();
        }

        // DELETE: api/Reminders/5
        [EnableCors("CorsPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReminder(long id)
        {
            var user = await usermanager.FindByNameAsync(User.Identity.Name);
            var reminder = await _context.Reminders.FindAsync(id);
            if (reminder == null || user == null)
            {
                return NotFound();
            }
            if (reminder.UserId == user.Id)
            {
                _context.Reminders.Remove(reminder);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private bool ReminderExists(long id)
        {
            return _context.Reminders.Any(e => e.Id == id);
        }
    }
}
