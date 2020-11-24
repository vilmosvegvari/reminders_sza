using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ReminderContext : DbContext
    {
        public ReminderContext(DbContextOptions<ReminderContext> options)
            : base(options)
        {
        }

        public DbSet<Reminder> Reminders { get; set; }
    }
}
