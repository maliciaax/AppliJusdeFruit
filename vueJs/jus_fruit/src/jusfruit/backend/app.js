const express = require('express') //import express
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const port = 3000

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // à adapter
    password: '',       // à adapter
    database: 'appjusfruit'
})

db.connect((err) => {
    if (err) {
        console.error('Erreur connexion BDD :', err)
        return
    }
    console.log('Connecté à la base de données appjusfruit')
})

// ─── PRODUITS JUS ────────────────────────────────────────────────────────────

// GET tous les jus
app.get('/jus', (req, res) => {
    db.query('SELECT * FROM produit_jus', (err, results) => {
        if (err) return res.json([false, err])
        res.json([true, results])
    })
})

// GET un jus par id
app.get('/jus/:id', (req, res) => {
    db.query('SELECT * FROM produit_jus WHERE idJus = ?', [req.params.id], (err, results) => {
        if (err) return res.json([false, err])
        res.json([true, results[0]])
    })
})

// ─── EMBALLAGES ───────────────────────────────────────────────────────────────

// GET tous les emballages
app.get('/emballages', (req, res) => {
    db.query('SELECT * FROM emballage', (err, results) => {
        if (err) return res.json([false, err])
        res.json([true, results])
    })
})

// ─── FRUITS ───────────────────────────────────────────────────────────────────

// GET tous les fruits (composition d'un jus)
app.get('/fruits/:idJus', (req, res) => {
    const sql = `
        SELECT f.nomFruit, f.typeFruit, c.quantiteFruit
        FROM contenir c
        JOIN fruit f ON f.idFruit = c.idFruit
        WHERE c.idJus = ?
    `
    db.query(sql, [req.params.idJus], (err, results) => {
        if (err) return res.json([false, err])
        res.json([true, results])
    })
})

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

// POST inscription client
app.post('/client/inscription', (req, res) => {
    const { nomClient, prenomClient, mailClient, numClient, adresseClient, cdpClient, mdp } = req.body
    const sql = `INSERT INTO client (nomClient, prenomClient, mailClient, numClient, adresseClient, cdpClient, mdp)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
    db.query(sql, [nomClient, prenomClient, mailClient, numClient, adresseClient, cdpClient, mdp], (err, results) => {
        if (err) return res.json([false, err])
        res.json([true, results.insertId])
    })
})

// POST connexion client
app.post('/client/connexion', (req, res) => {
    const { mailClient, mdp } = req.body
    db.query('SELECT * FROM client WHERE mailClient = ? AND mdp = ?', [mailClient, mdp], (err, results) => {
        if (err) return res.json([false, err])
        if (results.length === 0) return res.json([false, 'Identifiants incorrects'])
        res.json([true, results[0]])
    })
})

// ─── COMMANDES ────────────────────────────────────────────────────────────────

// POST créer une commande
app.post('/commande', (req, res) => {
    const { idClient, lignes } = req.body
    // lignes = [{ idJus, idEmb, qte, texteEmb }]

    const idCom = 'CMD-' + Date.now()
    const dateCmd = new Date()

    db.query(
        'INSERT INTO commande (idCom, etat, date_commande, idClient) VALUES (?, ?, ?, ?)',
        [idCom, 'En attente', dateCmd, idClient],
        (err) => {
            if (err) return res.json([false, err])

            const lignesSQL = lignes.map((l, i) => [idCom, i + 1, l.qte, l.idEmb, l.idJus])
            db.query(
                'INSERT INTO ligne_commande (idCom, numLigne, qte, idEmb, idJus) VALUES ?',
                [lignesSQL],
                (err2) => {
                    if (err2) return res.json([false, err2])
                    res.json([true, idCom])
                }
            )
        }
    )
})

// GET commandes d'un client
app.get('/commandes/:idClient', (req, res) => {
    const sql = `
        SELECT c.idCom, c.etat, c.date_commande,
               lc.numLigne, lc.qte,
               pj.nomJus, pj.prixUnitaire,
               e.nomEmb, e.typeEmb, e.colorisEmb, e.texteEmb, e.prixEmb
        FROM commande c
        JOIN ligne_commande lc ON lc.idCom = c.idCom
        JOIN produit_jus pj ON pj.idJus = lc.idJus
        JOIN emballage e ON e.idEmb = lc.idEmb
        WHERE c.idClient = ?
        ORDER BY c.date_commande DESC
    `
    db.query(sql, [req.params.idClient], (err, results) => {
        if (err) return res.json([false, err])
        res.json([true, results])
    })
})

// ─── START ────────────────────────────────────────────────────────────────────

app.listen(port, () => {
    console.log(`Serveur JusFruit démarré sur http://localhost:${port}`)
})
