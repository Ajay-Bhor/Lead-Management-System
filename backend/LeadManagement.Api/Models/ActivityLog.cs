using System.ComponentModel.DataAnnotations;

namespace LeadManagement.Api.Models
{
    public class ActivityLog
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string LeadId { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "Note"; // Call, Meeting, Email, Note, StatusChange

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Outcome { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        public string LoggedBy { get; set; } = "Ajay Bhor";
    }
}
