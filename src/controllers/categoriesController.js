import db from "../db.js";

export async function getCategories(req, res){
    try {
        const data = await db.query('SELECT * FROM categories');
        res.status(200).send(data.rows);
    } catch (e) {
        console.log("Erro ao buscar categorias!",e);
        res.status(500).send("Erro ao buscar categorias!",e);
    }
}

export async function postCategorie(req, res) {
    const body = req.body;

    if(!body.name){
        return res.sendStatus(400);
    }
    const nameLower = body.name.toLowerCase();
    const name = nameLower[0].toUpperCase() + nameLower.substring(1);

    try {
        const query = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
        if (query.rows.length !== 0) {
            return res.sendStatus(409);
        }

        await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        return res.sendStatus(201);
    } catch (e) {
        console.log("Erro salvar nova categoria.",e);
        res.status(500).send("Erro salvar nova categoria.",e);
    }
}