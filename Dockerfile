FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY backend/*.sln .
COPY backend/*.csproj .
RUN dotnet restore

# copy everything else and build app
COPY backend/. ./backend/
WORKDIR /app/backend
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS runtime
WORKDIR /app
COPY --from=build /app/backend/out ./
#ENTRYPOINT ["dotnet", "backend.dll"]
CMD ASPNETCORE_URLS=http://*:$PORT dotnet backend.dll