import { createPool, Pool } from 'mysql2/promise';

export async function connect(): Promise<Pool> {
    try {
        const connection = await createPool({
            host: 'localhost',
            user: 'root',
            password: 'workshop',
            database: 'WorkshopDB',
            connectionLimit: 10
        });
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        return connection;
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
}
