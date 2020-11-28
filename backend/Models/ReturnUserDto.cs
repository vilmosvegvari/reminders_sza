using backend.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ReturnUserDto
    {
        public string Email { get; set; }
        public string UserId { get; set; }
        public bool IsAdmin { get; set; }

        public ReturnUserDto(User user)
        {
            Email = user.Email;
            UserId = user.Id;
            IsAdmin = user.IsAdmin;
        }
    }
}
