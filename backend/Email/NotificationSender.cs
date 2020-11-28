using backend.Authentication;
using backend.Models;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;

namespace backend.Email
{
    public class NotificationSender
    {
        private SmtpClient smtp;
        private readonly ReminderContext _context;
        private readonly UserManager<User> usermanager;
        public NotificationSender(ReminderContext context, UserManager<User> usermanager)
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
                    if (reminder.Notification == "email")
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
                        SendEmail(message);
                    }
                    if (reminder.Notification == "api")
                        SendApiCallback(reminder);

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
            foreach (var item in _context.Reminders)
            {
                if ((item.Notification == "email" || item.Notification == "api") && !item.NotificationSent && CompareDate(item.Deadline))
                    list.Add(item);
            }
            return list;
        }

        private bool CompareDate(DateTime date2)
        {
            var date = DateTime.Now;
            date = date.AddMilliseconds(-date.Millisecond);
            date = date.AddSeconds(-date.Second);

            if (date.Year == date2.Year && date.Month == date2.Month && date.Day == date2.Day && date.Hour == date2.Hour && date.Minute == date2.Minute)
                return true;
            return false;
        }

        public async void SendEmail(MimeMessage message)
        {
            if (!smtp.IsAuthenticated)
            {
                smtp.Connect("smtp.gmail.com", 465);
                smtp.Authenticate("reminders.app2020@gmail.com", "ipxlnzzbxqrlropn");

            }
            await smtp.SendAsync(message);
            Console.WriteLine("email sent");
        }
        public async void SendApiCallback(Reminder reminder)
        {
            HttpClient client = new HttpClient();
            var notification = new ReminderNotificationDto();

            notification.Name = reminder.Name;
            notification.Deadline = reminder.Deadline;
            notification.Description = reminder.Description;

            await client.PostAsJsonAsync(reminder.CallbackUrl, notification);
        }
    }
}
