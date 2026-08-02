using System.ComponentModel.DataAnnotations;

namespace LeadManagement.Api.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Sales Executive"; // Admin, Sales Manager, Sales Executive
        
        public string Name { get; set; } = string.Empty;
    }
}
