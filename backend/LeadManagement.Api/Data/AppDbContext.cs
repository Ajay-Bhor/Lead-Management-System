using LeadManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeadManagement.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Lead> Leads { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
    }
}
