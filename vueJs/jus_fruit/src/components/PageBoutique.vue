<template>
    <div class="boutique">
        <h1>🛒 Nos Jus Frais</h1>
        <p class="sous-titre">Choisissez votre jus et personnalisez votre emballage</p>

        <div v-if="chargement" class="chargement">⏳ Chargement des produits...</div>

        <div v-else-if="erreur" class="erreur">❌ {{ erreur }}</div>

        <div v-else class="liste-jus">
            <div
                class="carte-jus"
                v-for="jus in listJus"
                :key="jus.idJus"
                @click="selectionnerJus(jus)"
            >
                <div class="jus-emoji">{{ emojiJus(jus.nomJus) }}</div>
                <div class="jus-info">
                    <h3>{{ jus.nomJus }}</h3>
                    <p class="description">{{ jus.description }}</p>
                    <div class="prix-badge">{{ jus.prixUnitaire }} €</div>
                </div>
                <button class="btn-commander">Personnaliser →</button>
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
                    if (data[0] === true) {
                        this.listJus = data[1]
                    } else {
                        this.erreur = 'Impossible de charger les produits.'
                    }
                    this.chargement = false
                })
                .catch(() => {
                    this.erreur = 'Erreur de connexion au serveur.'
                    this.chargement = false
                })
        },
        selectionnerJus(jus) {
            this.$emit('selectionnerJus', jus)
        },
        emojiJus(nom) {
            const n = nom.toLowerCase()
            if (n.includes('orange')) return '🍊'
            if (n.includes('mangue')) return '🥭'
            if (n.includes('ananas')) return '🍍'
            if (n.includes('fraise')) return '🍓'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
            if (n.includes('citron')) return '🍋'
            if (n.includes('pomme')) return '🍎'
            return '🥤'
        }
    },
    mounted() {
        this.chargerJus()
    }
}
</script>

<style scoped>
.boutique {
    padding: 3rem 4rem;
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    color: #f3f3f3;
}

.boutique h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.sous-titre {
    color: #aaa;
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
}

.chargement, .erreur {
    text-align: center;
    padding: 3rem;
    font-size: 1.1rem;
    color: #aaa;
}

.erreur { color: #ff6b6b; }

.liste-jus {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.carte-jus {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.carte-jus:hover {
    transform: translateY(-4px);
    border-color: #FF6B35;
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.2);
}

.jus-emoji {
    font-size: 4rem;
    text-align: center;
}

.jus-info h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #FF6B35;
}

.description {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.8rem;
}

.prix-badge {
    display: inline-block;
    background: rgba(255, 107, 53, 0.2);
    color: #FF6B35;
    border: 1px solid #FF6B35;
    padding: 0.25rem 0.8rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1rem;
}

.btn-commander {
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-top: auto;
}

.btn-commander:hover {
    opacity: 0.9;
}
</style>
