# Stage 1: Build the ASP.NET Core API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LeadManagement.Api.csproj", "./"]
RUN dotnet restore "./LeadManagement.Api.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "LeadManagement.Api.csproj" -c Release -o /app/build
RUN dotnet publish "LeadManagement.Api.csproj" -c Release -o /app/publish

# Stage 2: Serve the API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LeadManagement.Api.dll"]
