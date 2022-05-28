import db from "../db.js";

import gameSchema from "../schemas/gameSchema.js";

export async function getGames(req, res) {
    const {name} = req.query;

    try {
        if (name) {
            const query = await db.query(
                `SELECT games.*, categories.name as "categoryName"
                FROM games JOIN  categories ON games."categoryId"=categories.id
                WHERE LOWER (games.name) LIKE  LOWER ('${name}%')`
            );

            return res.status(200).send(query.rows);
        }
        
        const query = await db.query(
            `SELECT games.*, categories.name as "categoryName"
            FROM games JOIN  categories ON games."categoryId"=categories.id`
        );

        return res.status(200).send(query.rows);

    } catch (e) {
        console.log("Erro ao buscar games.",e);
        res.status(500).send("Erro ao buscar games.");
    }
}

export async function postNewGame(req, res) {
    const { name, image, pricePerDay, stockTotal, categoryId } = req.body
    const gameData = gameSchema.validate({name, image, pricePerDay, stockTotal});

    if (gameData.error) {
        return res.status(400).send(gameData);
    }

    try {
        //const query = await db.query('SELECT games.name, categories.id as "categoryIdInBD" FROM games JOIN categories ON games."categoryId"=categories.id');
        const queryName = await db.query('SELECT games.name FROM games WHERE name=$1', [name]);
        if (queryName.rows.length !== 0) {
            return res.sendStatus(409);
        }

        const queryCategoryId = await db.query('SELECT categories.id FROM categories WHERE id=$1', [categoryId]);
        if (queryCategoryId.rows.length === 0) {
            return res.sendStatus(400);
        }

        await db.query(
            'INSERT INTO games (name, image, "categoryId", "pricePerDay", "stockTotal") VALUES ($1, $2, $3, $4, $5)', 
            [name, image, categoryId, pricePerDay, stockTotal]
        );

        res.sendStatus(201);
    } catch (e) {
        console.log("Erro ao salvar um jogo novo.",e);
        res.status(500).send("Erro ao salvar um jogo novo.");
    }
}