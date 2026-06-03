<template>
    <div class="boutique">
        <div class="entete">
            <h1>Nos jus frais</h1>
            <p>Cliquez sur un jus pour le personnaliser</p>
        </div>

        <div v-if="chargement" class="message">Chargement…</div>
        <div v-else-if="erreur" class="message erreur">{{ erreur }}</div>

        <div v-else class="grille">
            <div
                class="carte-jus"
                v-for="jus in listJus"
                :key="jus.idJus"
                @click="$emit('selectionnerJus', jus)"
            >
                <div class="emoji">{{ emojiJus(jus.nomJus) }}</div>
                <div class="infos">
                    <h3>{{ jus.nomJus }}</h3>
                    <p>{{ jus.description }}</p>
                </div>
                <div class="bas-carte">
                    <span class="prix">{{ jus.prixUnitaire }} €</span>
                    <button class="btn-choisir">Personnaliser →</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageBoutique',
    emits: ['selectionnerJus'],
    data() {
        return {
            listJus: [],
            chargement: true,
            erreur: null
        }
    },
    methods: {
        chargerJus() {
            fetch('http://localhost:3000/jus')
                .then(res => res.json())
                .then(data => {
                    if (data[0] === true) { this.listJus = data[1] }
                    else { this.erreur = 'Impossible de charger les produits.' }
                    this.chargement = false
                })
                .catch(() => { this.erreur = 'Erreur de connexion au serveur.'; this.chargement = false })
        },
        emojiJus(nom) {
            const n = nom.toLowerCase()
            if (n.includes('orange'))      return '🍊'
            if (n.includes('citron'))      return '🍋'
            if (n.includes('mangue'))      return '🥭'
            if (n.includes('ananas'))      return '🍍'
            if (n.includes('fraise'))      return '🍓'
            if (n.includes('framboise'))   return '🍇'
            if (n.includes('myrtille'))    return '🫐'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
            if (n.includes('pomme'))       return '🍎'
            if (n.includes('poire'))       return '🍐'
            if (n.includes('pêche') || n.includes('peche')) return '🍑'
            if (n.includes('pamplemousse')) return '🍊'
            return '🥤'
        }
    },
    mounted() { this.chargerJus() }
}
</script>

<style scoped>
.boutique { padding: 2rem; max-width: 1100px; margin: 0 auto; }

.entete { margin-bottom: 1.5rem; }
.entete h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.3rem; }
.entete p  { color: var(--texte-doux); font-size: 0.95rem; }

.message { padding: 3rem; text-align: center; color: var(--texte-doux); }
.message.erreur { color: #e74c3c; }

/* Grille de cartes */
.grille {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
}

.carte-jus {
    background: var(--carte);
    border: 1px solid var(--bordure);
    border-radius: var(--radius);
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    transition: border-color 0.15s, transform 0.15s;
}
.carte-jus:hover {
    border-color: var(--vert);
    transform: translateY(-2px);
}

.emoji { font-size: 2.5rem; }

.infos h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
}
.infos p {
    color: var(--texte-doux);
    font-size: 0.85rem;
    line-height: 1.5;
}

.bas-carte {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.8rem;
    border-top: 1px solid var(--bordure);
}
.prix {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--vert);
}
.btn-choisir {
    background: var(--vert);
    border: none;
    color: #fff;
    padding: 0.4rem 0.9rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s;
}
.btn-choisir:hover { background: var(--vert-hover); }
</style>
