using System.ComponentModel.DataAnnotations;

namespace LeadManagement.Api.Models
{
    public class Lead
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public string? Phone { get; set; }
        
        public string? Company { get; set; }
        
        [Required]
        public string Status { get; set; } = "New"; // New, Contacted, Qualified, Proposal Sent, Won, Lost
        
        [Required]
        public string Source { get; set; } = "Website forms";
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
