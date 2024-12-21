# Establecer la imagen base para la construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar el archivo .csproj y restaurar las dependencias
COPY *.csproj ./
RUN dotnet restore

# Copiar el resto de los archivos y construir la aplicación
COPY . ./
RUN dotnet publish -c Release -o out

# Establecer la imagen base para ejecutar la aplicación
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 80

# Comando para ejecutar la aplicación
ENTRYPOINT ["dotnet", "LoteriaWebApi.dll"]
