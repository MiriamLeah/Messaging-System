using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class MessagesController : ControllerBase
    {
        private readonly IMessagesService _service;
        public record CreateMessageRequest(string Content);
        public MessagesController(IMessagesService messageService)
        {
            _service = messageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
           
            try
            {
                var messages = await _service.GetAllMessages();
                return Ok(messages);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to load messages");
            }
        }

        
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Content is required");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            try
            {
                await _service.AddMessage(request.Content, userId);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return StatusCode(500, "Failed to send message");
            }
        }
    }
}
