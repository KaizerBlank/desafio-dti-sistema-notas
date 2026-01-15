var builder = WebApplication.CreateBuilder(args);

// 1. Adiciona os serviços
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- ESSA PARTE É A PERMISSÃO DE ACESSO (CORS) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});
// -------------------------------------------------

var app = builder.Build();

// 2. Configurações
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Vamos comentar essa linha para evitar conflitos de HTTP/HTTPS por enquanto

app.UseCors("PermitirTudo"); // <--- APLICA A PERMISSÃO AQUI

app.MapControllers();

app.Run();