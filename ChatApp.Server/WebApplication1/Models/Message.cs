namespace WebApplication1.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string SenderId { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
