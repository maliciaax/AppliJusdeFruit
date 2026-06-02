# 🍊 JusFruit — Site de vente de jus avec emballage personnalisable

## Structure du projet

```
jusfruit/
├── appjusfruit_updated.sql       ← BDD mise à jour (à importer dans phpMyAdmin)
├── backend/
│   ├── app.js                    ← Serveur Node.js / Express
│   └── package.json
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.js
        ├── App.vue               ← Gestion de la navigation par événements
        └── components/
            ├── NavBar.vue
            ├── PageAccueil.vue
            ├── PageBoutique.vue
            ├── PagePersonnalisation.vue
            ├── PagePanier.vue
            ├── PageAuth.vue      ← Connexion + Inscription
            ├── PageCommandes.vue
            └── PageConfirmation.vue
```

---

## 1. Base de données

Importe le fichier `appjusfruit_updated.sql` dans phpMyAdmin.

> ⚠️ Ce fichier ajoute deux colonnes à la table `emballage` :
> - `texteEmb` — texte personnalisé sur l'emballage (optionnel)
> - `imageEmb` — chemin ou URL d'une image (optionnel)

---

## 2. Backend (Node.js)

### Installation
```bash
cd backend
npm install
```

### Configuration BDD
Dans `app.js`, modifie les identifiants de connexion :
```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // ton user MySQL
    password: '',       // ton mot de passe MySQL
    database: 'appjusfruit'
})
```

### Démarrage
```bash
node app.js
# ou en mode développement :
npx nodemon app.js
```
Le serveur tourne sur **http://localhost:3000**

### Routes disponibles
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/jus` | Tous les jus |
| GET | `/jus/:id` | Un jus par ID |
| GET | `/emballages` | Tous les emballages |
| GET | `/fruits/:idJus` | Fruits composant un jus |
| POST | `/client/inscription` | Créer un compte |
| POST | `/client/connexion` | Se connecter |
| POST | `/commande` | Passer une commande |
| GET | `/commandes/:idClient` | Commandes d'un client |

---

## 3. Frontend (Vue.js)

### Installation
```bash
cd frontend
npm install
```

### Démarrage
```bash
npm run dev
```
L'app tourne sur **http://localhost:5173**

---

## 4. Fonctionnement de la navigation

La navigation suit exactement le même pattern que le projet de référence fourni :
- Pas de Vue Router
- Un état `pageCourante` dans `App.vue`
- Les composants émettent des événements `@naviguer('nomPage')`
- `App.vue` écoute et change la page avec `v-if / v-else-if`

```vue
<!-- Exemple dans un composant enfant -->
<button @click="$emit('naviguer', 'boutique')">Voir la boutique</button>

<!-- Dans App.vue -->
<PageBoutique v-if="pageCourante === 'boutique'" @naviguer="naviguer" />
```

---

## 5. Personnalisation de l'emballage

Le composant `PagePersonnalisation.vue` permet de :
- Choisir un **type d'emballage** (bouteille, carton, canette…)
- Choisir une **couleur** via un color picker + palette rapide
- Uploader une **image** (glisser-déposer ou clic)
- Saisir un **texte personnalisé** (optionnel, 80 caractères max)
- Visualiser un **aperçu en temps réel** de l'emballage

---

## 6. Compte de test

| Champ | Valeur |
|-------|--------|
| Email | `patate-kawaii@gmail.com` |
| Mot de passe | `Jesu!isTr0pB!en` |
