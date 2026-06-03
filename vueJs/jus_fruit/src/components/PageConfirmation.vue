<template>
    <div class="confirmation">
        <div class="carte">
            <div class="icone">✅</div>
            <h1>Commande confirmée !</h1>
            <p>Merci <strong>{{ client.prenomClient }}</strong> ! Votre commande <strong>#{{ idCommande }}</strong> a bien été enregistrée.</p>

            <!-- Récap articles -->
            <div class="recap">
                <div class="recap-article" v-for="(article, i) in panier" :key="i">
                    <div class="mini-brique" :style="{ background: article.emballage.colorisEmb }">
                        {{ emojiJus(article.jus.nomJus) }}
                    </div>
                    <div class="infos">
                        <strong>{{ article.jus.nomJus }}</strong>
                        <span>{{ article.emballage.nomEmb }} × {{ article.qte }}</span>
                        <span v-if="article.emballage.texteEmb" class="texte-perso">"{{ article.emballage.texteEmb }}"</span>
                    </div>
                    <span class="prix">{{ article.total }} €</span>
                </div>
            </div>

            <!-- Étapes de livraison -->
            <div class="etapes">
                <div class="etape actif">📥 Reçue</div>
                <div class="tiret">—</div>
                <div class="etape">🏭 Préparation</div>
                <div class="tiret">—</div>
                <div class="etape">🚚 Expédition</div>
                <div class="tiret">—</div>
                <div class="etape">✅ Livré</div>
            </div>

            <!-- Boutons -->
            <div class="actions">
                <button class="btn-outline" @click="$emit('naviguer', 'mesCommandes')">Voir mes commandes</button>
                <button class="btn-vert"    @click="$emit('naviguer', 'boutique')">Continuer les achats</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageConfirmation',
    props: {
        client:       { type: Object, required: true },
        panier:       { type: Array,  required: true },
        idCommande:   { type: String, required: true }
    },
    emits: ['naviguer'],
    methods: {
        emojiJus(nom) {
            const n = (nom || '').toLowerCase()
            if (n.includes('orange'))   return '🍊'
            if (n.includes('citron'))   return '🍋'
            if (n.includes('mangue'))   return '🥭'
            if (n.includes('ananas'))   return '🍍'
            if (n.includes('fraise'))   return '🍓'
            if (n.includes('myrtille')) return '🫐'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
            if (n.includes('pomme'))    return '🍎'
            if (n.includes('poire'))    return '🍐'
            if (n.includes('pêche') || n.includes('peche')) return '🍑'
            return '🥤'
        }
    }
}
</script>

<style scoped>
.confirmation {
    min-height: 100vh; background: var(--fond);
    display: flex; align-items: center; justify-content: center; padding: 2rem;
}

.carte {
    background: var(--carte); border: 1px solid var(--bordure);
    border-radius: 16px; padding: 2.5rem; width: 100%;
    max-width: 500px; text-align: center;
}

.icone { font-size: 3.5rem; margin-bottom: 1rem; }

h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; }
p  { color: var(--texte-doux); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5; }

/* Récap */
.recap {
    background: var(--fond); border: 1px solid var(--bordure);
    border-radius: var(--radius); padding: 1rem;
    margin-bottom: 1.5rem; text-align: left;
    display: flex; flex-direction: column; gap: 0.8rem;
}

.recap-article { display: flex; align-items: center; gap: 0.9rem; }
.mini-brique {
    width: 40px; height: 54px; border-radius: 9px 9px 5px 5px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
}
.infos { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
.infos strong { font-size: 0.88rem; }
.infos span   { font-size: 0.78rem; color: var(--texte-doux); }
.texte-perso  { font-style: italic; }
.prix { color: var(--vert); font-weight: 700; font-size: 0.9rem; white-space: nowrap; }

/* Étapes */
.etapes {
    display: flex; align-items: center; justify-content: center;
    gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;
}
.etape {
    font-size: 0.78rem; color: var(--texte-doux);
    padding: 0.3rem 0.7rem; border-radius: 20px;
    background: var(--fond); border: 1px solid var(--bordure);
}
.etape.actif { background: rgba(76,175,80,0.15); border-color: var(--vert); color: var(--vert); font-weight: 600; }
.tiret { color: #444; font-size: 0.8rem; }

/* Boutons */
.actions { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }

.btn-outline {
    background: none; border: 1px solid var(--bordure); color: var(--texte);
    padding: 0.65rem 1.4rem; border-radius: var(--radius);
    font-size: 0.9rem; font-family: inherit; cursor: pointer; transition: border-color 0.15s;
}
.btn-outline:hover { border-color: #666; }

.btn-vert {
    background: var(--vert); border: none; color: #fff;
    padding: 0.65rem 1.4rem; border-radius: var(--radius);
    font-size: 0.9rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: background 0.15s;
}
.btn-vert:hover { background: var(--vert-hover); }
</style>
