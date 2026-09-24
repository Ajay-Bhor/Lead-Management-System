using LeadManagement.Api.Data;
using LeadManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeadManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LeadsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeadsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lead>>> GetLeads()
        {
            return await _context.Leads.OrderByDescending(l => l.Date).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lead>> GetLead(string id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }
            return lead;
        }

        [HttpPost]
        public async Task<ActionResult<Lead>> PostLead(Lead lead)
        {
            lead.Id = Guid.NewGuid().ToString();
            lead.Date = DateTime.UtcNow;

            // 1. Automated Lead Assignment (Round-Robin) if not assigned
            if (string.IsNullOrWhiteSpace(lead.AssignedTo) || lead.AssignedTo == "Auto Round-Robin")
            {
                lead.AssignedTo = await GetNextRoundRobinAssigneeAsync();
            }

            // 2. Automated Lead Scoring & Priority Calculation
            lead.Score = CalculateLeadScore(lead);
            lead.Priority = DeterminePriority(lead.Score);

            _context.Leads.Add(lead);

            // 3. Log initial activity
            _context.ActivityLogs.Add(new ActivityLog
            {
                Id = Guid.NewGuid().ToString(),
                LeadId = lead.Id,
                Type = "StatusChange",
                Title = "Lead Captured & Assigned",
                Description = $"Lead entered system via {lead.Source} and assigned to {lead.AssignedTo}. Initial Score: {lead.Score} ({lead.Priority}).",
                Date = DateTime.UtcNow,
                LoggedBy = User.Identity?.Name ?? "System"
            });

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLead), new { id = lead.Id }, lead);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLead(string id, Lead lead)
        {
            if (id != lead.Id)
            {
                return BadRequest();
            }

            // Recalculate score and priority
            lead.Score = CalculateLeadScore(lead);
            lead.Priority = DeterminePriority(lead.Score);

            _context.Entry(lead).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeadExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        public class UpdateStageDto
        {
            public string Stage { get; set; } = string.Empty;
        }

        [HttpPatch("{id}/stage")]
        public async Task<IActionResult> UpdateStage(string id, [FromBody] UpdateStageDto dto)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }

            var previousStage = lead.Status;
            lead.Status = dto.Stage;

            // Boost score if moving deeper into pipeline
            if (dto.Stage == "Qualified" && lead.Score < 65) lead.Score = 70;
            if (dto.Stage == "Proposal Sent" && lead.Score < 75) lead.Score = 80;
            if (dto.Stage == "Negotiation" && lead.Score < 85) lead.Score = 90;
            if (dto.Stage == "Won") lead.Score = 100;
            if (dto.Stage == "Lost") lead.Score = 20;
            lead.Priority = DeterminePriority(lead.Score);

            _context.ActivityLogs.Add(new ActivityLog
            {
                Id = Guid.NewGuid().ToString(),
                LeadId = lead.Id,
                Type = "StatusChange",
                Title = $"Stage Moved to {dto.Stage}",
                Description = $"Moved pipeline stage from '{previousStage}' to '{dto.Stage}'.",
                Date = DateTime.UtcNow,
                LoggedBy = User.Identity?.Name ?? lead.AssignedTo
            });

            await _context.SaveChangesAsync();
            return Ok(lead);
        }

        public class ReassignDto
        {
            public string Assignee { get; set; } = string.Empty;
        }

        [HttpPatch("{id}/reassign")]
        public async Task<IActionResult> ReassignLead(string id, [FromBody] ReassignDto dto)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }

            var prev = lead.AssignedTo;
            lead.AssignedTo = dto.Assignee == "Auto Round-Robin" 
                ? await GetNextRoundRobinAssigneeAsync() 
                : dto.Assignee;

            _context.ActivityLogs.Add(new ActivityLog
            {
                Id = Guid.NewGuid().ToString(),
                LeadId = lead.Id,
                Type = "Note",
                Title = "Lead Reassigned",
                Description = $"Reassigned from {prev} to {lead.AssignedTo}.",
                Date = DateTime.UtcNow,
                LoggedBy = User.Identity?.Name ?? "System"
            });

            await _context.SaveChangesAsync();
            return Ok(lead);
        }

        [HttpGet("{id}/activities")]
        public async Task<ActionResult<IEnumerable<ActivityLog>>> GetActivities(string id)
        {
            return await _context.ActivityLogs
                .Where(a => a.LeadId == id)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        [HttpPost("{id}/activities")]
        public async Task<ActionResult<ActivityLog>> PostActivity(string id, [FromBody] ActivityLog activity)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }

            activity.Id = Guid.NewGuid().ToString();
            activity.LeadId = id;
            activity.Date = DateTime.UtcNow;
            if (string.IsNullOrWhiteSpace(activity.LoggedBy))
            {
                activity.LoggedBy = User.Identity?.Name ?? lead.AssignedTo;
            }

            // Increase lead score on engagement activity
            if (activity.Type == "Meeting") lead.Score = Math.Min(100, lead.Score + 10);
            if (activity.Type == "Call") lead.Score = Math.Min(100, lead.Score + 5);
            if (activity.Type == "Email") lead.Score = Math.Min(100, lead.Score + 3);
            lead.Priority = DeterminePriority(lead.Score);

            _context.ActivityLogs.Add(activity);
            await _context.SaveChangesAsync();

            return Ok(activity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLead(string id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }

            // Remove associated activities
            var activities = _context.ActivityLogs.Where(a => a.LeadId == id);
            _context.ActivityLogs.RemoveRange(activities);

            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeadExists(string id)
        {
            return _context.Leads.Any(e => e.Id == id);
        }

        private async Task<string> GetNextRoundRobinAssigneeAsync()
        {
            var users = await _context.Users.Select(u => u.Name).ToListAsync();
            if (users.Count == 0) return "Ajay Bhor";

            // Count existing leads per user to distribute evenly
            var counts = await _context.Leads
                .GroupBy(l => l.AssignedTo)
                .Select(g => new { Assignee = g.Key, Count = g.Count() })
                .ToListAsync();

            var leastLoaded = users
                .Select(u => new { Name = u, Count = counts.FirstOrDefault(c => c.Assignee == u)?.Count ?? 0 })
                .OrderBy(x => x.Count)
                .FirstOrDefault();

            return leastLoaded?.Name ?? users[0];
        }

        private static int CalculateLeadScore(Lead lead)
        {
            int score = 40;

            // Source scoring
            switch (lead.Source)
            {
                case "Phone calls": score += 25; break;
                case "Website forms": score += 20; break;
                case "Social media": score += 15; break;
                case "Email campaigns": score += 10; break;
                default: score += 10; break;
            }

            // Deal Value boost
            if (lead.DealValue > 100000) score += 20;
            else if (lead.DealValue > 50000) score += 15;
            else if (lead.DealValue > 10000) score += 10;

            // Information completeness
            if (!string.IsNullOrWhiteSpace(lead.Phone)) score += 10;
            if (!string.IsNullOrWhiteSpace(lead.Company)) score += 5;
            if (!string.IsNullOrWhiteSpace(lead.Territory)) score += 5;

            return Math.Clamp(score, 10, 100);
        }

        private static string DeterminePriority(int score)
        {
            if (score >= 75) return "Hot";
            if (score >= 50) return "Warm";
            return "Cold";
        }
    }
}
