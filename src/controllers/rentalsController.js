import dayjs from "dayjs";
import { query } from "express";
import db from "../db.js";

import rentSchema from "../schemas/rentSchema.js"

export async function createNewRental(req, res) {
    const rentAllData = rentSchema.validate(req.body);

    if (rentAllData.error) {
        res.sendStatus(400);
    }
    const {customerId, gameId, daysRented} = rentAllData.value;
    

    try {
        const games = await db.query('SELECT games.*, customers.id AS "clientId" FROM games JOIN customers ON games.id=$1 AND customers.id=$2', [gameId, customerId]);

        if (games.rows.length === 0) {
            return res.sendStatus(400);
        }

        if (games.rows[0].stockTotal <= 0) {
            return res.sendStatus(400);
        }

        const data = {
            rentDate: dayjs(new Date).format("YYYY-MM-DD"),
            returnDate: null,
            originalPrice: parseFloat(games.rows[0].pricePerDay) * daysRented,
            delayFee: null,
        };
        
        await db.query(
            `
                INSERT INTO rentals 
                ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                customerId, 
                gameId, 
                data.rentDate, 
                daysRented, 
                data.returnDate, 
                data.originalPrice, 
                data.delayFee
            ]
        );

        res.sendStatus(201);
    } catch (e) {
        console.log("Erro ao realizar aluguel", e);
        return res.sendStatus(500);
    }
}

export async function getRentals(req, res) {
    const {customerId, gameId} = req.query;

    try {
        if (customerId) {
            const rental = await db.query(
                `
                    SELECT 
                        rentals.*, 
                        jsonb_build_object(
                            'name', customers.name, 
                            'id', rentals."customerId"
                        ) AS customer, 
                        jsonb_build_object(
                            'id', rentals."gameId", 
                            'name', games.name, 
                            'categoryId', games."categoryId",
                        'categoryName', categories.name
                        ) AS game
                    FROM rentals 
                    JOIN customers ON  customers.id=$1
                    JOIN games ON games.id=rentals."gameId"
                    JOIN categories ON categories.id=games."categoryId"
                    WHERE rentals."customerId" = $1
                    
                `, [customerId]
            );
                            
            const data = rental.rows.map((item)=>{
                item.rentDate =  dayjs(item.rentDate).format("YYYY-MM-DD")
                return item;
            })
            
            return res.send(data);
        }

        if (gameId) {
            const rental = await db.query(
                `
                    SELECT 
                        rentals.*, 
                        jsonb_build_object(
                            'name', customers.name, 
                            'id', rentals."customerId"
                        ) AS customer, 
                        jsonb_build_object(
                            'id', rentals."gameId", 
                            'name', games.name, 
                            'categoryId', games."categoryId",
                        'categoryName', categories.name
                        ) AS game
                    FROM rentals 
                    JOIN customers ON  customers.id=rentals."customerId"
                    JOIN games ON games.id=rentals."gameId"
                    JOIN categories ON categories.id=games."categoryId"
                    WHERE rentals."gameId" = $1
                    
                `, [ gameId]
            );

            const data = rental.rows.map((item)=>{
                item.rentDate =  dayjs(item.rentDate).format("YYYY-DD-MM")
                return item;
            })
            
            return res.send(data);
        }

        const rental = await db.query(
            `
                SELECT 
                    rentals.*, 
                    jsonb_build_object(
                        'name', customers.name, 
                        'id', rentals."customerId"
                    ) AS customer, 
                    jsonb_build_object(
                        'id', rentals."gameId", 
                        'name', games.name, 
                        'categoryId', games."categoryId",
                    'categoryName', categories.name
                    ) AS game
                FROM rentals 
                JOIN customers ON  customers.id=rentals."customerId"
                JOIN games ON games.id=rentals."gameId"
                JOIN categories ON categories.id=games."categoryId"
                WHERE rentals.id!=0
                
            `
        );

        const data = rental.rows.map((item)=>{
            item.rentDate =  dayjs(item.rentDate).format("YYYY-DD-MM")
            return item;
        })
        
        return res.send(data);


    } catch (e) {
        console.log("Erro ao buscar os alugueis", e);
        return res.sendStatus(500);
    }
}

export async function terminateRent(req, res){
    const {id} = req.params;
    const actualDate = dayjs(new Date).format("YYYY-MM-DD");
    


    try {
        const query = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        let delayFee = 0;
        if (query.rows.length <= 0 ) {
            return res.sendStatus(404);
        }
        if(query.rows[0].returnDate !== null){
            return res.sendStatus(400);
        }

        
        const delay = parseInt(dayjs(actualDate).format("DD")) - parseInt(dayjs(query.rows[0].rentDate).format("DD"));
        const atraso = delay - query.rows[0].daysRented;
        

        if ( atraso > 0) {
            delayFee = atraso * (query.rows[0].originalPrice / query.rows[0].daysRented);
        } else {
            delayFee = 0;
        }

        await db.query(
            `
                UPDATE rentals
                SET "returnDate" = $1, "delayFee" = $2
                WHERE id=$3
            `
            ,[actualDate, delayFee, id]
            );

        return res.sendStatus(200)
    } catch (e) {
        console.log("Erro ao encerrar aluguel", e);
        return res.sendStatus(500);
    }
}

export async function deleteRent(req, res){
    const {id} = req.params;

    try {
        const query = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (query.rows.length <= 0 ) {
            return res.sendStatus(404);
        }
        if(query.rows[0].returnDate !== null){
            return res.sendStatus(400);
        }

        await db.query(`DELETE FROM rentals WHERE id = $1 `,[id]);

        return res.sendStatus(200);
    } catch (e) {
        console.log("Erro ao deletar aluguel", e);
        return res.sendStatus(500);
    }
}
