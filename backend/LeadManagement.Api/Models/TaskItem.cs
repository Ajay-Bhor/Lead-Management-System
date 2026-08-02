using System.ComponentModel.DataAnnotations;

namespace LeadManagement.Api.Models
{
    public class TaskItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "Follow-up"; // Follow-up, Meeting, Call

        public DateTime DueDate { get; set; }

        public string? LeadId { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
