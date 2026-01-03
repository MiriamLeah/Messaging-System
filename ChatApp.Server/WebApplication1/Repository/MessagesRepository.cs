using System.Collections.Concurrent;
using WebApplication1.Models;

namespace WebApplication1.Repository
{

    public interface IMessagesRepository
    {
        Task<IReadOnlyList<Message>> GetAllMessages();
        Task AddMessage(Message message);
    }
    public class MessagesRepository : IMessagesRepository
    {
        // This implementation is a mock for the database. In production, this would connect to the DB.
        private readonly ConcurrentBag<Message> _messages = new();
        private int _currentId = 0;

        public Task<IReadOnlyList<Message>> GetAllMessages()
        {
            var snapshot = _messages.ToArray();

            // החזרת כל ההודעות ללא סינון, רק מיון לפי ה-ID
            IReadOnlyList<Message> ordered = snapshot
                .OrderBy(m => m.Id)
                .ToList();

            return Task.FromResult(ordered);
        }

        public Task AddMessage(Message message)
        {
            // in real DB remove this line - will be initialzied in the DB.

            message.Id =Interlocked.Increment(ref _currentId);

            _messages.Add(message);
            return Task.CompletedTask;
        }
    }
}
