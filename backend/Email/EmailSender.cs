using backend.Authentication;
using backend.Models;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Email
{
    public class EmailSender
    {
        SmtpClient smtp;
        private readonly ReminderContext _context;
        UserManager<User> usermanager;
        public EmailSender(ReminderContext context, UserManager<User> usermanager)
        {
            _context = context;
            this.usermanager = usermanager;
            smtp = new SmtpClient();
        }
        public async void SendReminderAsync()
        {
            while (true)
            {
                if (!smtp.IsAuthenticated)
                {
                    smtp.Connect("smtp.gmail.com", 465);
                    smtp.Authenticate("reminders.app2020@gmail.com", "ipxlnzzbxqrlropn");

                }

                var list = GetReminders();
                foreach (var reminder in list)
                {
                    var user = await usermanager.FindByIdAsync(reminder.UserId);
                    var message = new MimeMessage();
                    message.To.Add(new MailboxAddress("", user.Email));
                    message.From.Add(new MailboxAddress("", "reminders.app2020@gmail.com"));
                    message.Subject = "Notification: " + reminder.Name;
                    message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                    {
                        Text = reminder.Description
                    };
                    SendMessage(message);
                    reminder.NotificationSent = true;
                    _context.Entry(reminder).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }
                Thread.Sleep(10000);
            }
        }

        private List<Reminder> GetReminders()
        {
            var list = new List<Reminder>();
            var date = DateTime.Now;
            date = date.AddMilliseconds(-date.Millisecond);
            date = date.AddSeconds(-date.Second);
            foreach (var item in _context.Reminders)
            {
                if (item.Notification == "email" && !item.NotificationSent && CompareDate(date,item.Deadline))
                    list.Add(item);
            }
            return list;
        }

        private bool CompareDate(DateTime date1, DateTime date2)
        {
            if (date1.Year == date2.Year && date1.Month == date2.Month && date1.Day == date2.Day && date1.Hour == date2.Hour && date1.Minute == date2.Minute)
                return true;
            return false;
        }

        public async void SendMessage(MimeMessage message)
        {
            if (!smtp.IsAuthenticated)
            {
                smtp.Connect("smtp.gmail.com", 465);
                smtp.Authenticate("reminders.app2020@gmail.com", "ipxlnzzbxqrlropn");

            }
            await smtp.SendAsync(message);
            Console.WriteLine("email sent");
        }
    }
}
