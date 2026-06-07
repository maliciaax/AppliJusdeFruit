const express = require('express') //import express
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: [
        "http://localhost:8080",
        "http://mansmalicia.alwaysdata.net/"
    ],
    credentials: true
}))
app.use(express.json())
app.use(express.static("dist"))

const port = process.env.PORT || 8300;

const db = mysql.createConnection({
    host: 'host',
    user: 'user',
    password: 'mpd',
    database: 'bdd'
})

db.connect((err) => {
    if (err) {
        console.error('Erreur connexion BDD :', err)
        return
    }
    console.log('Connecté à la base de données appjusfruit')
})

app.get('/', (req, res) => {
    res.json("serveur marche")
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

// ─── PROFIL CLIENT ────────────────────────────────────────────────────────────

// GET profil d'un client
app.get('/client/:id', (req, res) => {
    db.query('SELECT idClient, nomClient, prenomClient, mailClient, numClient, adresseClient, cdpClient FROM client WHERE idClient = ?', [req.params.id], (err, results) => {
        if (err) return res.json([false, err])
        if (results.length === 0) return res.json([false, 'Client introuvable'])
        res.json([true, results[0]])
    })
})

// DELETE supprimer un compte client (commandes et lignes associées)
app.delete('/client/:id', (req, res) => {
    const idClient = req.params.id

    // 1. Récupérer les idCom du client
    db.query('SELECT idCom FROM commande WHERE idClient = ?', [idClient], (err, commandes) => {
        if (err) return res.json([false, err])

        const suite = () => {
            // 3. Supprimer les commandes
            db.query('DELETE FROM commande WHERE idClient = ?', [idClient], (err3) => {
                if (err3) return res.json([false, err3])
                // 4. Supprimer le client
                db.query('DELETE FROM client WHERE idClient = ?', [idClient], (err4) => {
                    if (err4) return res.json([false, err4])
                    res.json([true, 'Compte supprimé'])
                })
            })
        }

        if (commandes.length === 0) {
            suite()
        } else {
            const ids = commandes.map(c => c.idCom)
            // 2. Supprimer les lignes de commande
            db.query('DELETE FROM ligne_commande WHERE idCom IN (?)', [ids], (err2) => {
                if (err2) return res.json([false, err2])
                suite()
            })
        }
    })
})
