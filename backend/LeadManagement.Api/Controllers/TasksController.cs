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
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            return await _context.Tasks.OrderBy(t => t.DueDate).ToListAsync();
        }

        [HttpGet("reminders")]
        public async Task<ActionResult<IEnumerable<object>>> GetReminders()
        {
            var now = DateTime.UtcNow;
            var upcomingLimit = now.AddDays(3);

            var pendingTasks = await _context.Tasks
                .Where(t => !t.IsCompleted)
                .OrderBy(t => t.DueDate)
                .ToListAsync();

            var reminders = pendingTasks.Select(t => new
            {
                t.Id,
                t.Title,
                t.Type,
                t.DueDate,
                t.LeadId,
                t.IsCompleted,
                IsOverdue = t.DueDate < now.Date,
                IsDueToday = t.DueDate.Date == now.Date,
                Urgency = t.DueDate < now.Date ? "High" : (t.DueDate.Date == now.Date ? "Medium" : "Normal")
            });

            return Ok(reminders);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> PostTask(TaskItem task)
        {
            task.Id = Guid.NewGuid().ToString();
            task.CreatedAt = DateTime.UtcNow;

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteTask(string id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.IsCompleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(string id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
