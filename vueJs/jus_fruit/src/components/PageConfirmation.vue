<template>
    <div class="confirmation">
        <div class="confetti">🎉</div>
        <h1>Commande confirmée !</h1>
        <p class="sous-titre">Merci <strong>{{ client.prenomClient }}</strong> ! Votre commande <strong>#{{ idCommande }}</strong> a bien été enregistrée.</p>

        <div class="recap">
            <div class="recap-article" v-for="(article, i) in panier" :key="i">
                <div class="mini-bouteille" :style="{ background: article.emballage.colorisEmb }">
                    <span>{{ emojiJus(article.jus.nomJus) }}</span>
                </div>
                <div>
                    <strong>{{ article.jus.nomJus }}</strong>
                    <span> × {{ article.qte }}</span>
                    <div class="detail-emb">{{ article.emballage.nomEmb }}</div>
                    <div v-if="article.emballage.texteEmb" class="texte-perso">"{{ article.emballage.texteEmb }}"</div>
                </div>
                <div class="prix">{{ article.total }} €</div>
            </div>
        </div>

        <div class="etat-livraison">
            <div class="etape actif">📥 Commande reçue</div>
            <div class="fleche">→</div>
            <div class="etape">🏭 Préparation</div>
            <div class="fleche">→</div>
            <div class="etape">🚚 Expédition</div>
            <div class="fleche">→</div>
            <div class="etape">✅ Livré</div>
        </div>

        <div class="actions">
            <button class="btn-commandes" @click="$emit('naviguer', 'mesCommandes')">📦 Voir mes commandes</button>
            <button class="btn-boutique" @click="$emit('naviguer', 'boutique')">🛒 Continuer les achats</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageConfirmation',
    props: {
        client: { type: Object, required: true },
        panier: { type: Array, required: true },
        idCommande: { type: String, required: true }
    },
    emits: ['naviguer'],
    methods: {
        emojiJus(nom) {
            const n = (nom || '').toLowerCase()
            if (n.includes('orange')) return '🍊'
            if (n.includes('mangue')) return '🥭'
            if (n.includes('ananas')) return '🍍'
            if (n.includes('fraise')) return '🍓'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
            return '🥤'
        }
    }
}
</script>

<style scoped>
.confirmation {
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    color: #f3f3f3;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem;
    text-align: center;
}

.confetti { font-size: 5rem; margin-bottom: 1rem; animation: bounce 1s ease infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-20px); } }

h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.sous-titre { color: #aaa; font-size: 1.05rem; margin-bottom: 2.5rem; }

.recap {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.5rem;
    width: 100%;
    max-width: 480px;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.recap-article {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: left;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}
.recap-article:last-child { border-bottom: none; padding-bottom: 0; }

.mini-bouteille {
    width: 48px; height: 72px;
    border-radius: 18px 18px 10px 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.detail-emb { font-size: 0.8rem; color: #888; }
.texte-perso { font-size: 0.8rem; color: #aaa; font-style: italic; }
.prix { margin-left: auto; color: #FF6B35; font-weight: 700; white-space: nowrap; }

/* Étapes livraison */
.etat-livraison {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 2.5rem;
}
.etape {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    color: #888;
}
.etape.actif {
    background: rgba(255,107,53,0.2);
    border-color: #FF6B35;
    color: #FF6B35;
    font-weight: 600;
}
.fleche { color: #555; font-size: 1.2rem; }

/* Actions */
.actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.btn-commandes {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 0.8rem 1.8rem;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.2s;
}
.btn-commandes:hover { background: rgba(255,255,255,0.15); }
.btn-boutique {
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    border: none;
    color: #fff;
    padding: 0.8rem 1.8rem;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: opacity 0.2s;
}
.btn-boutique:hover { opacity: 0.9; }
</style>
