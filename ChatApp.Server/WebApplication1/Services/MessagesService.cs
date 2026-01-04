using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using WebApplication1.Hubs;
using WebApplication1.Models;
using WebApplication1.Repository;

namespace WebApplication1.Services
{

    public interface IMessagesService
    {
        Task<IReadOnlyList<MessageDto>> GetAllMessages();
        Task AddMessage(string content, string senderUserId);
    }
    public class MessagesService : IMessagesService
    {
        private readonly IMessagesRepository _repo;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessagesService(IMessagesRepository repo ,  IHubContext<ChatHub> hubContext)
        {
            _repo = repo;
            _hubContext = hubContext;
        }

        public async Task<IReadOnlyList<MessageDto>> GetAllMessages()
        {
            IReadOnlyList<Message> messages = await _repo.GetAllMessages();
            var dtos = messages
            .Select(m => new MessageDto
            {
                Content = m.Content,
                Timestamp = m.Timestamp,
            })
            .ToList();

            return dtos;
        }
       

        public async Task AddMessage(string content ,string senderUserId)
        {
            if (string.IsNullOrWhiteSpace(senderUserId))
                throw new ArgumentException("Missing sender user id");

            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Message content is empty");

            content = content.Trim();


            var msg = new Message
            {
                Content = content,
                SenderId = senderUserId,
                Timestamp = DateTime.UtcNow
            };
            await _repo.AddMessage(msg);

            var msgDto = new MessageDto
            {                
                Content = msg.Content,
                Timestamp = msg.Timestamp
            };

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", msgDto);
        }

        
    }
}
