using backend.Authentication;
using backend.Models;
using MailKit.Net.Imap;
using MailKit.Search;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Email
{
    public class EmailReciever
    {
        private readonly ReminderContext _context;
        private readonly UserManager<User> usermanager;
        private readonly EmailSender sender;
        ImapClient imap;
        public EmailReciever(ReminderContext context, UserManager<User> usermanager, EmailSender sender)
        {
            _context = context;
            this.usermanager = usermanager;
            this.sender = sender;
            imap = new ImapClient();
        }
        public async void ProcessMailsAsync()
        {
            while (true)
            {
                if (!imap.IsAuthenticated)
                {
                    imap.Connect("imap.gmail.com", 993);
                    imap.Authenticate("reminders.app2020@gmail.com", "ipxlnzzbxqrlropn");

                }
                imap.Inbox.Open(MailKit.FolderAccess.ReadWrite);
                var uids = imap.Inbox.Search(SearchQuery.NotSeen);
                foreach (var uid in uids)
                {
                    var eml = imap.Inbox.GetMessage(uid);
                    MailboxAddress from = (MailboxAddress)eml.From[0];
                    var address = from.Address;
                    User user = await usermanager.FindByEmailAsync(address);

                    if (user != null)
                        await ProcessAsync(user, eml);
                    else 
                        UserNotRegistered(address);

                    imap.Inbox.AddFlags(uid, MailKit.MessageFlags.Seen, true);
                }

                Thread.Sleep(10000);
            }
        }
        public async Task ProcessAsync(User user, MimeMessage email)
        {
            try
            {
                var body = email.TextBody.Split("\r\n", 4);
                if (body.Length < 4)
                    throw new NotImplementedException();

                Reminder reminder = new Reminder();
                reminder.UserId = user.Id;
                reminder.Name = body[0];
                reminder.Deadline = DateTime.Parse(body[1]);
                reminder.Notification = body[2];
                reminder.Description = body[3];
                reminder.NotificationSent = false;

                _context.Reminders.Add(reminder);
                await _context.SaveChangesAsync();

                Console.WriteLine(email.Subject + " email processed");
            }
            catch 
            {
                WrongEmailFormat(user.Email);
            }
        }
        public void UserNotRegistered(string address)
        {
            var message = new MimeMessage();
            message.To.Add(new MailboxAddress("", address));
            message.From.Add(new MailboxAddress("", "reminders.app2020@gmail.com"));
            message.Subject = "Please register first";
            message.Body = new TextPart(MimeKit.Text.TextFormat.Text)
            {
                Text = "There is no user registered with this email address. \r\n Please register before using the services of the application."
            };
            sender.SendMessage(message);
        }

        public void WrongEmailFormat(string address)
        {
            var message = new MimeMessage();
            message.To.Add(new MailboxAddress("", address));
            message.From.Add(new MailboxAddress("", "reminders.app2020@gmail.com"));
            message.Subject = "Wong format";
            message.Body = new TextPart(MimeKit.Text.TextFormat.Text)
            {
                Text = "We could not process the sent reminder, because the format was not appropriate.\r\n Please read the documentation about how to add new reminder with email."
            };
            sender.SendMessage(message);
        }
    }
}
