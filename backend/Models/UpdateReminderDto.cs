using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UpdateReminderDto
    {
        public string Name { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime Creation { get; set; }
        public string Description { get; set; }
        public string Notification { get; set; }
    }
}
