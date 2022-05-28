import db from "../db.js";

import customerSchema from "../schemas/customerSchema.js";

export async function getCustomers(req, res) {
    const { cpf } = req.query;

    try {
        if (cpf) {
            const query = await db.query(
                `SELECT * FROM customers WHERE cpf LIKE '${cpf}%'`
            );
            return res.status(200).send(query.rows);
        }

        const query = await db.query('SELECT * FROM customers');
        return res.status(200).send(query.rows);

    } catch (e) {
        console.log("Erro ao buscar os clientes.",e);
        res.status(500).send("Erro ao buscar os clientes.");
    }
}

export async function getCustomerById(req, res) {
    const { id }=  req.params;

    try {
        const query = await db.query('SELECT * FROM customers WHERE id=$1', [id]);
        return query.rows.length === 0 
        ?  res.sendStatus(404)
        :  res.status(200).send(query.rows);

    } catch (e) {
        console.log("Erro ao buscar os clientes.",e);
        res.status(500).send("Erro ao buscar os clientes.");
    }
}

export async function postNewCustomer(req, res) {
    const userData = customerSchema.validate(req.body);

    if (userData.error) {
        console.log(userData.error);
        return res.sendStatus(400);
    }
    const {name, phone, cpf, birthday} = userData.value;

    try {
        const query = await db.query('SELECT * FROM customers WHERE cpf=$1', [cpf]);

        if (query.rows.length >0) {
            return res.sendStatus(409);
        }

        await db.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (e) {
        console.log("Erro ao salvar um novo cliente.",e);
        res.status(500).send("Erro ao salvar um novo cliente.");
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const updateCustomerData = customerSchema.validate(req.body);

    console.log(updateCustomerData.value)

    if (updateCustomerData.error) {
        return res.sendStatus(400);
    }

    const {name, phone, cpf, birthday} = updateCustomerData.value;
    
    try {
        const query = await db.query('SELECT * FROM customers WHERE cpf=$1 AND id!=$2', [cpf, id]);
        const teste = query.rows;

        console.log(teste)

        if (query.rows.length > 0) {
            return res.sendStatus(409);
        }

        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,[name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (e) {
        console.log("Erro ao atualizar cliente.",e);
        res.sendStatus(500);
    }
}
