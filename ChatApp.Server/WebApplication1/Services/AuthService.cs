using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Repository;



namespace WebApplication1.Services
{
    public interface IAuthService
    {
        Task<string> Login(string userId);
    }
       
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IConfiguration _config;


        public AuthService(IUserRepository users, IConfiguration config)
        {
            _users = users;
            _config = config;
        }

      
        public async Task<string> Login(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("Missing userId");

            userId = userId.Trim();

            var isAllowed = await _users.IsAllowed(userId);
            if (!isAllowed)
                throw new UnauthorizedAccessException("User not allowed");

            return CreateToken(userId);
        }

        // Note: In a production system, use two tokens (Access and Refresh) 
        // to balance security and user experience across multiple servers.
        private string CreateToken(string userId)
        {
            var secret = _config["Jwt:Key"]!;
            var keyBytes = Encoding.UTF8.GetBytes(secret);

            var tokenHandler = new JwtSecurityTokenHandler();

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId)
                }),
                Expires = DateTime.UtcNow.AddMinutes(60), 
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(descriptor);
            return tokenHandler.WriteToken(token);
        }
       
    }
}
