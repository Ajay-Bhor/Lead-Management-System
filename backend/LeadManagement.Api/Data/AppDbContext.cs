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
    }
}
