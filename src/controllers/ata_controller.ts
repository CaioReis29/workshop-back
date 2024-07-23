import { Request, Response } from 'express';
import { connect } from '../config/db_config';
import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';

async function getPool() {
    return await connect();
}

export const getAtas = async (req: Request, res: Response) => {
    const { workshopNome, data } = req.query;
    let query = `
        SELECT a.id as ata_id, w.id as workshop_id, w.nome as workshop_nome, w.dataRealizacao, w.descricao, 
               c.id as colaborador_id, c.nome as colaborador_nome
        FROM Ata a 
        LEFT JOIN Workshop w ON a.workshop_id = w.id 
        LEFT JOIN Ata_Colaboradores ac ON a.id = ac.ata_id 
        LEFT JOIN Colaborador c ON ac.colaborador_id = c.id
    `;

    const queryParams: (string | null)[] = [];
    if (workshopNome) {
        query += `WHERE w.nome LIKE ? `;
        queryParams.push(`%${workshopNome}%`);
    }
    if (data) {
        query += `${workshopNome ? 'AND' : 'WHERE'} w.dataRealizacao = ? `;
        queryParams.push(data as string);
    }

    query += 'ORDER BY w.dataRealizacao ASC, c.nome ASC';

    try {
        const pool = await getPool();
        const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

        const atasMap = new Map<number, { id: number; workshop: any; colaboradores: any[] }>();

        rows.forEach((row: any) => {
            if (!atasMap.has(row.ata_id)) {
                atasMap.set(row.ata_id, {
                    id: row.ata_id,
                    workshop: {
                        id: row.workshop_id,
                        nome: row.workshop_nome,
                        dataRealizacao: row.dataRealizacao,
                        descricao: row.descricao,
                    },
                    colaboradores: []
                });
            }
            if (row.colaborador_id) {
                atasMap.get(row.ata_id)?.colaboradores.push({
                    id: row.colaborador_id,
                    nome: row.colaborador_nome,
                });
            }
        });

        const atas = Array.from(atasMap.values());
        res.send(atas);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};

export const createAta = async (req: Request, res: Response) => {
    const { workshop_id, colaboradores } = req.body as { workshop_id: number; colaboradores: number[] };
    try {
        const pool = await getPool();
        const [result] = await pool.query('INSERT INTO Ata (workshop_id) VALUES (?)', [workshop_id]);
        const ata_id = (result as mysql.OkPacketParams).insertId;

        for (const colaborador_id of colaboradores) {
            await pool.query('INSERT INTO Ata_Colaboradores (ata_id, colaborador_id) VALUES (?, ?)', [ata_id, colaborador_id]);
        }

        res.send({ id: ata_id, workshop_id, colaboradores });
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};

export const addColaboradorToAta = async (req: Request, res: Response) => {
    const { ataId, colaboradorId } = req.params;
    try {
        const pool = await getPool();
        await pool.query('INSERT INTO Ata_Colaboradores (ata_id, colaborador_id) VALUES (?, ?)', [ataId, colaboradorId]);
        res.send({ message: 'Colaborador adicionado à ata com sucesso' });
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};

export const removeColaboradorFromAta = async (req: Request, res: Response) => {
    const { ataId, colaboradorId } = req.params;
    try {
        const pool = await getPool();
        await pool.query('DELETE FROM Ata_Colaboradores WHERE ata_id = ? AND colaborador_id = ?', [ataId, colaboradorId]);
        res.send({ message: 'Colaborador removido da ata com sucesso' });
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};
