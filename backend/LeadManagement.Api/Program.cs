using LeadManagement.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
        };
    });

// Configure CORS for the React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite/React defaults
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations at startup (for convenience in development)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.EnsureCreated(); 

        // Seed initial data if empty
        if (!dbContext.Users.Any())
        {
            dbContext.Users.Add(new LeadManagement.Api.Models.User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "admin",
                PasswordHash = "admin",
                Role = "Admin",
                Name = "Ajay Bhor"
            });
            dbContext.Users.Add(new LeadManagement.Api.Models.User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "sarah",
                PasswordHash = "password123",
                Role = "Sales Manager",
                Name = "Sarah Smith"
            });
        }

        if (!dbContext.Leads.Any())
        {
            dbContext.Leads.AddRange(
                new LeadManagement.Api.Models.Lead { Id = Guid.NewGuid().ToString(), Name = "Acme Corp Deal", Email = "contact@acme.com", Phone = "+1 555-0192", Company = "Acme Corp", Status = "Qualified", Source = "Website forms", Date = DateTime.UtcNow.AddDays(-2) },
                new LeadManagement.Api.Models.Lead { Id = Guid.NewGuid().ToString(), Name = "TechFlow Systems", Email = "sales@techflow.io", Phone = "+1 555-0144", Company = "TechFlow", Status = "New", Source = "Social media", Date = DateTime.UtcNow.AddDays(-1) },
                new LeadManagement.Api.Models.Lead { Id = Guid.NewGuid().ToString(), Name = "Starlight Retail", Email = "info@starlight.com", Phone = "+1 555-0188", Company = "Starlight Inc", Status = "Proposal Sent", Source = "Email campaigns", Date = DateTime.UtcNow }
            );
        }

        if (!dbContext.Tasks.Any())
        {
            dbContext.Tasks.AddRange(
                new LeadManagement.Api.Models.TaskItem { Id = Guid.NewGuid().ToString(), Title = "Call Sarah regarding pricing", Type = "Call", DueDate = DateTime.UtcNow.AddDays(1), IsCompleted = false, CreatedAt = DateTime.UtcNow },
                new LeadManagement.Api.Models.TaskItem { Id = Guid.NewGuid().ToString(), Title = "Product demo with TechFlow", Type = "Meeting", DueDate = DateTime.UtcNow.AddDays(2), IsCompleted = false, CreatedAt = DateTime.UtcNow }
            );
        }
        dbContext.SaveChanges();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Could not create database: {ex.Message}");
    }
}

app.Run();
