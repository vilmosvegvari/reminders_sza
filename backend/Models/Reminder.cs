using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Reminder
    {
        public long Id { get; set; }
        public string UserId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Deadline is required")]
        public DateTime Deadline { get; set; }
        public DateTime Creation { get; set; }
        public string Description { get; set; }

        [Required(ErrorMessage = "Notificationtype is required")]
        public string Notification { get; set; }
        public bool NotificationSent { get; set; }
        public string CallbackUrl { get; set; }
    }

}
