using LeadManagement.Api.Data;
using LeadManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace LeadManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Simple hardcoded fallback for first run
            if (request.Username == "admin" && request.Password == "admin")
            {
                return Ok(new { 
                    Token = GenerateJwtToken("admin", "Admin"),
                    Role = "Admin",
                    Name = "Ajay Bhor",
                    Username = "admin"
                });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            
            // Note: In production, use proper password hashing (e.g., BCrypt). 
            // For this boilerplate, we'll assume PasswordHash stores the plain text or simple hash.
            if (user != null && user.PasswordHash == request.Password)
            {
                return Ok(new { 
                    Token = GenerateJwtToken(user.Username, user.Role),
                    Role = user.Role,
                    Name = user.Name,
                    Username = user.Username
                });
            }

            return Unauthorized("Invalid credentials.");
        }

        /// <summary>
        /// Only System Administrators are authorized to register or create new user accounts.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { Message = "Username and password are required." });
            }

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { Message = "Username already exists." });
            }

            var role = string.IsNullOrWhiteSpace(request.Role) ? "Sales Executive" : request.Role;
            var validRoles = new[] { "Admin", "Sales Manager", "Sales Executive" };
            if (!validRoles.Contains(role))
            {
                role = "Sales Executive";
            }

            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = request.Username,
                PasswordHash = request.Password,
                Name = string.IsNullOrWhiteSpace(request.Name) ? request.Username : request.Name,
                Role = role
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(newUser.Username, newUser.Role);
            return Ok(new { 
                Message = "User created successfully by Administrator.", 
                Token = token,
                User = new { newUser.Id, newUser.Username, newUser.Name, newUser.Role }
            });
        }

        private string GenerateJwtToken(string username, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("role", role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = "Sales Executive";
    }
}
