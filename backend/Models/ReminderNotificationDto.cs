using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ReminderNotificationDto
    {
        public string Name { get; set; }
        public DateTime Deadline { get; set; }
        public string Description { get; set; }

    }
}
