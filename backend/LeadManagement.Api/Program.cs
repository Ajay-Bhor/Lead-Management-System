using LeadManagement.Api.Data;
using LeadManagement.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF Core (supports SQLite and SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=leadmanagement.db";
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (connectionString.Contains(".db") || (connectionString.Contains("Data Source=") && !connectionString.Contains("Server=")))
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

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
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Global Exception Handling Middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var errorResponse = new
        {
            StatusCode = 500,
            Message = "An internal server error occurred.",
            Error = exceptionHandlerPathFeature?.Error?.Message
        };
        await context.Response.WriteAsJsonAsync(errorResponse);
    });
});

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations / create database & seed initial enterprise dataset
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.EnsureCreated();

        // Seed initial users if empty
        if (!dbContext.Users.Any())
        {
            dbContext.Users.Add(new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "admin",
                PasswordHash = "admin",
                Role = "Admin",
                Name = "Ajay Bhor"
            });
            dbContext.Users.Add(new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "sarah",
                PasswordHash = "password123",
                Role = "Sales Manager",
                Name = "Sarah Smith"
            });
            dbContext.Users.Add(new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "vikram",
                PasswordHash = "password123",
                Role = "Sales Executive",
                Name = "Vikram Joshi"
            });
            dbContext.Users.Add(new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "pooja",
                PasswordHash = "password123",
                Role = "Sales Executive",
                Name = "Pooja Kulkarni"
            });
            dbContext.SaveChanges();
        }

        // Seed enterprise multi-stage leads if empty
        if (!dbContext.Leads.Any())
        {
            var leadAcme = new Lead
            {
                Id = "lead-acme-01",
                Name = "Acme Corp Deal",
                Email = "contact@acme.com",
                Phone = "+91 98221 00192",
                Company = "Acme Global Solutions",
                Status = "Qualified",
                Source = "Website forms",
                DealValue = 180000,
                Score = 85,
                Priority = "Hot",
                AssignedTo = "Ajay Bhor",
                Territory = "Pune",
                Date = DateTime.UtcNow.AddDays(-3),
                Notes = "Interested in full enterprise supply agreement. Budget confirmed."
            };

            var leadTech = new Lead
            {
                Id = "lead-tech-02",
                Name = "TechFlow Systems",
                Email = "sales@techflow.io",
                Phone = "+91 98223 00144",
                Company = "TechFlow IT Ltd",
                Status = "New",
                Source = "Social media",
                DealValue = 95000,
                Score = 60,
                Priority = "Warm",
                AssignedTo = "Sarah Smith",
                Territory = "Mumbai",
                Date = DateTime.UtcNow.AddDays(-1),
                Notes = "Inquired about product catalog via LinkedIn campaign."
            };

            var leadStarlight = new Lead
            {
                Id = "lead-star-03",
                Name = "Starlight Retail Network",
                Email = "info@starlight.com",
                Phone = "+91 98225 00188",
                Company = "Starlight Retail Inc",
                Status = "Proposal Sent",
                Source = "Email campaigns",
                DealValue = 240000,
                Score = 90,
                Priority = "Hot",
                AssignedTo = "Ajay Bhor",
                Territory = "Pune",
                Date = DateTime.UtcNow.AddDays(-5),
                Notes = "Detailed quote sent. Follow-up meeting scheduled."
            };

            var leadGreen = new Lead
            {
                Id = "lead-green-04",
                Name = "GreenFields Agri Ventures",
                Email = "ops@greenfields.co.in",
                Phone = "+91 98229 11223",
                Company = "GreenFields Farm Ltd",
                Status = "Negotiation",
                Source = "Phone calls",
                DealValue = 350000,
                Score = 95,
                Priority = "Hot",
                AssignedTo = "Sarah Smith",
                Territory = "Nashik",
                Date = DateTime.UtcNow.AddDays(-7),
                Notes = "Reviewing contract terms and payment schedules."
            };

            var leadApex = new Lead
            {
                Id = "lead-apex-05",
                Name = "Apex Logistics Hub",
                Email = "procure@apexlog.com",
                Phone = "+91 98224 44556",
                Company = "Apex Logistics Co",
                Status = "Contacted",
                Source = "Manual entry",
                DealValue = 75000,
                Score = 55,
                Priority = "Warm",
                AssignedTo = "Ajay Bhor",
                Territory = "Nagpur",
                Date = DateTime.UtcNow.AddDays(-2),
                Notes = "Introductory call completed. Sending product brochure."
            };

            var leadDairy = new Lead
            {
                Id = "lead-dairy-06",
                Name = "Maharashtra Dairy Co-op",
                Email = "director@mhdairy.org",
                Phone = "+91 98227 77889",
                Company = "MH Dairy Federation",
                Status = "Won",
                Source = "Website forms",
                DealValue = 500000,
                Score = 100,
                Priority = "Hot",
                AssignedTo = "Ajay Bhor",
                Territory = "Kolhapur",
                Date = DateTime.UtcNow.AddDays(-10),
                Notes = "Contract signed. Onboarding initiated."
            };

            var leadVanguard = new Lead
            {
                Id = "lead-vanguard-07",
                Name = "Vanguard Equipments",
                Email = "procure@vanguard.com",
                Phone = "+91 98228 88990",
                Company = "Vanguard Tools",
                Status = "Lost",
                Source = "Email campaigns",
                DealValue = 120000,
                Score = 20,
                Priority = "Cold",
                AssignedTo = "Sarah Smith",
                Territory = "Mumbai",
                Date = DateTime.UtcNow.AddDays(-12),
                Notes = "Chose competitor due to timeline constraints."
            };

            dbContext.Leads.AddRange(leadAcme, leadTech, leadStarlight, leadGreen, leadApex, leadDairy, leadVanguard);

            // Seed initial activity logs for communication tracking
            dbContext.ActivityLogs.AddRange(
                new ActivityLog
                {
                    Id = Guid.NewGuid().ToString(),
                    LeadId = "lead-acme-01",
                    Type = "Call",
                    Title = "Discovery Call",
                    Description = "Discussed annual bulk requirements. Client expressed interest in long-term contract.",
                    Outcome = "Positive - Requested formal quotation",
                    Date = DateTime.UtcNow.AddDays(-2),
                    LoggedBy = "Ajay Bhor"
                },
                new ActivityLog
                {
                    Id = Guid.NewGuid().ToString(),
                    LeadId = "lead-acme-01",
                    Type = "Meeting",
                    Title = "Executive Presentation",
                    Description = "Demoed corporate specifications and delivery SLAs with procurement team.",
                    Outcome = "Budget Approved",
                    Date = DateTime.UtcNow.AddDays(-1),
                    LoggedBy = "Ajay Bhor"
                },
                new ActivityLog
                {
                    Id = Guid.NewGuid().ToString(),
                    LeadId = "lead-star-03",
                    Type = "Email",
                    Title = "Proposal Delivery",
                    Description = "Sent formal commercial proposal with discounted volume tiers.",
                    Outcome = "Awaiting decision",
                    Date = DateTime.UtcNow.AddDays(-3),
                    LoggedBy = "Ajay Bhor"
                },
                new ActivityLog
                {
                    Id = Guid.NewGuid().ToString(),
                    LeadId = "lead-green-04",
                    Type = "Meeting",
                    Title = "Negotiation Round 1",
                    Description = "Clarified delivery timelines and payment terms for bulk supply.",
                    Outcome = "Final contract draft prepared",
                    Date = DateTime.UtcNow.AddHours(-18),
                    LoggedBy = "Sarah Smith"
                }
            );

            dbContext.SaveChanges();
        }

        // Seed tasks and reminders if empty
        if (!dbContext.Tasks.Any())
        {
            dbContext.Tasks.AddRange(
                new TaskItem
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "Finalize contract terms with GreenFields Agri",
                    Type = "Meeting",
                    DueDate = DateTime.UtcNow.AddHours(4),
                    LeadId = "lead-green-04",
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new TaskItem
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "Follow up on proposal review with Starlight Retail",
                    Type = "Call",
                    DueDate = DateTime.UtcNow.AddDays(1),
                    LeadId = "lead-star-03",
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new TaskItem
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "Product demo with TechFlow Systems",
                    Type = "Meeting",
                    DueDate = DateTime.UtcNow.AddDays(2),
                    LeadId = "lead-tech-02",
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new TaskItem
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "Send onboarding pack to Maharashtra Dairy",
                    Type = "Follow-up",
                    DueDate = DateTime.UtcNow.AddDays(-1), // Overdue reminder demo
                    LeadId = "lead-dairy-06",
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                }
            );
            dbContext.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization error: {ex.Message}");
    }
}

app.Run();
