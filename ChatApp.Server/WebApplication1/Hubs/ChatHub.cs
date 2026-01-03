using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.Hubs
{
    [Authorize] 
    public class ChatHub : Hub
    {
        
    }
}
