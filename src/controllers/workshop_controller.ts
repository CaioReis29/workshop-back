import { Request, Response } from 'express';
import { connect } from '../config/db_config';
import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

async function getPool() {
    return await connect();
}

export const getWorkshops = async (req: Request, res: Response) => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT w.id as workshop_id, w.nome as workshop_nome, w.dataRealizacao, w.descricao,
                   c.id as colaborador_id, c.nome as colaborador_nome
            FROM Workshop w
            LEFT JOIN Ata a ON w.id = a.workshop_id
            LEFT JOIN Ata_Colaboradores ac ON a.id = ac.ata_id
            LEFT JOIN Colaborador c ON ac.colaborador_id = c.id
            ORDER BY w.id, c.nome
        `);

        const workshopsMap = new Map<number, {
            id: number;
            nome: string;
            dataRealizacao: string;
            descricao: string;
            colaboradores: { id: number; nome: string }[];
        }>();

        rows.forEach((row: any) => {
            if (!workshopsMap.has(row.workshop_id)) {
                workshopsMap.set(row.workshop_id, {
                    id: row.workshop_id,
                    nome: row.workshop_nome,
                    dataRealizacao: row.dataRealizacao,
                    descricao: row.descricao,
                    colaboradores: []
                });
            }
            if (row.colaborador_id) {
                workshopsMap.get(row.workshop_id)?.colaboradores.push({
                    id: row.colaborador_id,
                    nome: row.colaborador_nome,
                });
            }
        });

        const workshops = Array.from(workshopsMap.values());
        res.send(workshops);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};

export const getWorkshopById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pool = await getPool();

        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT w.id as workshop_id, w.nome as workshop_nome, w.dataRealizacao, w.descricao,
                   c.id as colaborador_id, c.nome as colaborador_nome
            FROM Workshop w
            LEFT JOIN Ata a ON w.id = a.workshop_id
            LEFT JOIN Ata_Colaboradores ac ON a.id = ac.ata_id
            LEFT JOIN Colaborador c ON ac.colaborador_id = c.id
            WHERE w.id = ?
            ORDER BY c.nome
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Workshop não encontrado' });
        }

        const workshop = rows.reduce((acc: any, row: any) => {
            if (!acc) {
                acc = {
                    id: row.workshop_id,
                    nome: row.workshop_nome,
                    dataRealizacao: row.dataRealizacao,
                    descricao: row.descricao,
                    colaboradores: [],
                };
            }
            if (row.colaborador_id) {
                acc.colaboradores.push({
                    id: row.colaborador_id,
                    nome: row.colaborador_nome,
                });
            }
            return acc;
        }, null);

        res.send(workshop);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};

export const createWorkshop = async (req: Request, res: Response) => {
    const { nome, dataRealizacao, descricao } = req.body as { nome: string; dataRealizacao?: string; descricao?: string };
    try {
        const pool = await getPool();
        const [result] = await pool.query('INSERT INTO Workshop (nome, dataRealizacao, descricao) VALUES (?, ?, ?)', [nome, dataRealizacao, descricao]);
        const workshopId = (result as mysql.OkPacket).insertId;
        res.send({ id: workshopId, nome, dataRealizacao, descricao });
    } catch (err: any) {
        res.status(500).send(err.message);
    }
};
