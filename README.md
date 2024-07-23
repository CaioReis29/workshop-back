# Workshop Management API

Este é um projeto de gerenciamento de workshops, colaboradores e atas usando Node.js com Express e TypeScript e Flutter para a interface web. O backend fornece uma API RESTful para manipular os dados.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Flutter
- MySQL
- Body-Parser
- CORS

## Instalação

### Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/workshop-back.git
   cd workshop_back/
   ```
2. Instale as dependências:
   ``` 
   npm i 
   ```
3. Configure o banco de dados MySQL:
   - Crie o WorkshopDB
     ```SQL
     CREATE DATABASE WorkshopDB;
     ```
   - Use o mesmo
     ```SQL
     USE WorkshopDB;
     ```
   - Crie as tabelas necessárias
     ```SQL
     CREATE TABLE colaboradores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL
      );

      CREATE TABLE workshops (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      dataRealizacao DATETIME
      );

      CREATE TABLE atas (
     id INT AUTO_INCREMENT PRIMARY KEY,
     workshopId INT,
      FOREIGN KEY (workshopId) REFERENCES workshops(id)
      );

      CREATE TABLE ata_colaboradores (
      ataId INT,
      colaboradorId INT,
     PRIMARY KEY (ataId, colaboradorId),
      FOREIGN KEY (ataId) REFERENCES atas(id),
      FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id)
      );
     ```
  4. Rode o servidor local
     ``` npm
     npx ts-node src/server.ts  
     ```

### Endpoints

Link da Collection para testes: https://www.postman.com/navigation-astronaut-57456295/workspace/workshop
