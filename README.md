# Sistema de Gestão de Notas - Desafio Técnico DTI

Este projeto consiste em uma solução Full Stack para o gerenciamento de notas e frequências escolares, desenvolvida como parte do processo seletivo da DTI Digital.

## Tecnologias Utilizadas

- **Back End:** C# (.NET 8 Web API)
- **Front End:** ReactJS + Vite
- **Comunicação:** Axios (HTTP Client)
- **Documentação da API:** Swagger UI

## Instruções para Executar o Sistema

Para rodar o projeto localmente, é necessário ter instalado o .NET SDK 8.0 e o Node.js.

### 1. Executando o Back End (API)
1. Navegue até a pasta `GestaoEscolarAPI`.
2. Abra um terminal neste diretório.
3. Execute o comando: `dotnet run`
4. O servidor iniciará e indicará a porta de execução (padrão: `http://localhost:5262`). Mantenha este terminal aberto.

### 2. Executando o Front End (Interface)
1. Navegue até a pasta `front-escolar`.
2. Abra um novo terminal neste diretório.
3. Instale as dependências com o comando: `npm install`
4. Inicie a aplicação com o comando: `npm run dev`
5. O terminal exibirá um link local. Acesse este link no navegador.

---

## Lista de Premissas Assumidas

Durante o desenvolvimento, as seguintes premissas foram adotadas para cobrir lacunas não especificadas na regra de negócio ou para adaptar o problema de console para web:

1. **Formato de Entrada das Notas:** O enunciado apresenta as notas separadas por espaços. Para melhorar a usabilidade na web, o sistema foi projetado para aceitar notas separadas tanto por vírgulas quanto por espaços.
2. **Cálculo de Destaque:** O requisito solicita alunos "acima da média da turma". Foi assumido que a comparação deve ser feita entre a "Média Final do Aluno" e a "Média Geral da Turma" (a média aritmética das médias de todas as disciplinas).
3. **Turmas Unitárias:** Caso a turma possua apenas um aluno, ele não é considerado "Destaque" (pois ele representa a própria média), evitando redundância na informação.
4. **Exibição de Resultados Vazios:** O requisito pede para imprimir uma linha vazia caso não haja destaques ou recuperação. Por se tratar de uma interface gráfica (Web), optou-se por exibir o texto "Nenhum" para dar feedback visual explícito ao usuário de que o cálculo foi realizado com sucesso, mas não houve correspondências.
5. **Persistência:** Como não foi solicitado banco de dados, os dados são processados em tempo de execução e não persistem após o recarregamento da página (F5), conforme comportamento esperado de uma aplicação stateless simplificada.

## Decisões de Projeto

A arquitetura foi desenhada para garantir a separação de responsabilidades (SoC):

- **API REST (Back End):** Centraliza toda a regra de negócio (cálculo de médias, lógica de aprovação e estatísticas). Isso garante que, se a interface mudar (para Mobile ou Desktop, por exemplo), a lógica permanece íntegra e reutilizável.
- **Robustez e Tipagem:** O uso de C# no Back End foi escolhido para garantir segurança de tipos e tratamento robusto de exceções matemáticas.
- **Validação no Cliente (Front End):** Implementou-se validação prévia (Regex) no React para garantir que o usuário envie apenas números válidos e na quantidade correta (5 notas), reduzindo carga desnecessária de erros no servidor.

## Outras Informações Importantes

- **Tratamento de Erros:** A API implementa blocos `try-catch` globais para capturar falhas inesperadas e retornar códigos HTTP padronizados (400 Bad Request para erros de entrada, 500 para erros internos).
- **Testes Manuais:** A API possui o Swagger habilitado (`/swagger`), permitindo o teste direto dos endpoints sem a necessidade da interface gráfica, caso desejado.
