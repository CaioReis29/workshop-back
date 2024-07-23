import { Request, Response } from 'express';
import { connect } from '../config/db_config';
import * as mysql from 'mysql2/promise';

async function getPool() {
    return await connect();
}

export const getColaboradores = async (req: Request, res: Response) => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query('SELECT id, nome FROM Colaborador ORDER BY nome ASC');
        
        if (Array.isArray(rows)) {
            const colaboradores = rows.map((row: any) => ({
                id: row.id,
                nome: row.nome
            }));
            res.send(colaboradores);
        } else {
            res.status(500).send('Erro ao processar dados');
        }
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};

export const createColaborador = async (req: Request, res: Response) => {
    const { nome } = req.body as { nome: string };
    try {
        const pool = await getPool();
        const [result] = await pool.query('INSERT INTO Colaborador (nome) VALUES (?)', [nome]);
        const colaboradorId = (result as mysql.OkPacket).insertId;
        res.send({ id: colaboradorId, nome });
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};
