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
        public string Status { get; set; } = "New"; // New, Contacted, Qualified, Proposal Sent, Negotiation, Won, Lost
        
        [Required]
        public string Source { get; set; } = "Website forms"; // Website forms, Social media, Email campaigns, Phone calls, Manual entry
        
        public DateTime Date { get; set; } = DateTime.UtcNow;

        // Enterprise CRM Properties
        public decimal DealValue { get; set; } = 0; // In INR / USD

        public int Score { get; set; } = 50; // Lead Score (0 - 100)

        public string Priority { get; set; } = "Warm"; // Hot, Warm, Cold

        public string AssignedTo { get; set; } = "Ajay Bhor"; // Round-robin or territory assignee

        public string? Territory { get; set; } = "Maharashtra"; // Territory / City

        public string? Notes { get; set; }
    }
}
