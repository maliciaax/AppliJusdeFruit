<template>
    <div class="panier">
        <div class="entete">
            <h1>Mon panier</h1>
            <button class="btn-retour" @click="$emit('naviguer', 'boutique')">← Continuer mes achats</button>
        </div>

        <!-- Panier vide -->
        <div v-if="panier.length === 0" class="vide">
            <span>🛒</span>
            <p>Votre panier est vide.</p>
            <button class="btn-vert" @click="$emit('naviguer', 'boutique')">Voir nos jus</button>
        </div>

        <div v-else class="contenu">
            <!-- Liste des articles -->
            <div class="liste">
                <div class="article" v-for="(article, index) in panier" :key="index">

                    <!-- Mini brique -->
                    <div class="mini-brique" :style="{ background: article.emballage.colorisEmb }">
                        <img v-if="article.emballage.imagePreview" :src="article.emballage.imagePreview" class="mini-img" alt="" />
                        <span>{{ emojiJus(article.jus.nomJus) }}</span>
                    </div>

                    <!-- Infos -->
                    <div class="article-infos">
                        <strong>{{ article.jus.nomJus }}</strong>
                        <span>{{ article.emballage.nomEmb }}</span>
                        <span v-if="article.emballage.texteEmb" class="texte-perso">"{{ article.emballage.texteEmb }}"</span>
                        <span v-if="article.emballage.imagePreview" class="texte-perso">🖼️ Image personnalisée</span>
                    </div>

                    <!-- Quantité -->
                    <div class="qte">
                        <button @click="diminuerQte(index)">−</button>
                        <span>{{ article.qte }}</span>
                        <button @click="augmenterQte(index)">+</button>
                    </div>

                    <!-- Prix -->
                    <div class="prix-article">{{ calculerPrix(article) }} €</div>

                    <!-- Supprimer -->
                    <button class="btn-suppr" @click="$emit('supprimerArticle', index)">✕</button>
                </div>
            </div>

            <!-- Récap total -->
            <div class="recap">
                <div class="recap-ligne">Sous-total <strong>{{ sousTotal }} €</strong></div>
                <div class="recap-ligne">Livraison  <strong>Offerte 🎉</strong></div>
                <div class="recap-ligne total">Total <strong>{{ sousTotal }} €</strong></div>

                <button class="btn-commander" @click="commander">✅ Passer la commande</button>

                <p v-if="!client" class="msg-connexion">
                    Vous devez être <span @click="$emit('naviguer', 'connexion')">connecté</span> pour commander.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PagePanier',
    props: {
        panier:  { type: Array,  required: true },
        client:  { type: Object, default: null }
    },
    emits: ['naviguer', 'supprimerArticle', 'mettreAJourQte', 'commander'],
    computed: {
        sousTotal() {
            return this.panier.reduce((s, a) => {
                return s + (parseFloat(a.jus.prixUnitaire) + parseFloat(a.emballage.prixEmb)) * a.qte
            }, 0).toFixed(2)
        }
    },
    methods: {
        calculerPrix(article) {
            return ((parseFloat(article.jus.prixUnitaire) + parseFloat(article.emballage.prixEmb)) * article.qte).toFixed(2)
        },
        emojiJus(nom) {
            const n = (nom || '').toLowerCase()
            if (n.includes('orange'))      return '🍊'
            if (n.includes('citron'))      return '🍋'
            if (n.includes('mangue'))      return '🥭'
            if (n.includes('ananas'))      return '🍍'
            if (n.includes('fraise'))      return '🍓'
            if (n.includes('myrtille'))    return '🫐'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
            if (n.includes('pomme'))       return '🍎'
            if (n.includes('poire'))       return '🍐'
            if (n.includes('pêche') || n.includes('peche')) return '🍑'
            return '🥤'
        },
        diminuerQte(index) {
            if (this.panier[index].qte > 1) {
                this.$emit('mettreAJourQte', { index, qte: this.panier[index].qte - 1 })
            } else {
                this.$emit('supprimerArticle', index)
            }
        },
        augmenterQte(index) {
            this.$emit('mettreAJourQte', { index, qte: this.panier[index].qte + 1 })
        },
        commander() {
            if (!this.client) { this.$emit('naviguer', 'connexion'); return }
            this.$emit('commander')
        }
    }
}
</script>

<style scoped>
.panier { padding: 2rem; max-width: 900px; margin: 0 auto; }

.entete {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 1.5rem;
}
.entete h1 { font-size: 1.6rem; font-weight: 700; }

.btn-retour {
    background: none; border: 1px solid var(--bordure);
    color: var(--texte-doux); padding: 0.4rem 0.9rem;
    border-radius: 8px; cursor: pointer; font-family: inherit;
    font-size: 0.9rem; transition: border-color 0.15s, color 0.15s;
}
.btn-retour:hover { border-color: #666; color: var(--texte); }

/* Panier vide */
.vide { text-align: center; padding: 5rem 2rem; color: var(--texte-doux); }
.vide span { font-size: 4rem; display: block; margin-bottom: 1rem; }
.vide p { font-size: 1.1rem; margin-bottom: 1.5rem; }
.btn-vert {
    background: var(--vert); border: none; color: #fff;
    padding: 0.7rem 1.6rem; border-radius: var(--radius);
    font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer;
}
.btn-vert:hover { background: var(--vert-hover); }

/* Layout articles + recap */
.contenu { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; align-items: start; }

/* Liste */
.liste { display: flex; flex-direction: column; gap: 0.8rem; }

.article {
    background: var(--carte); border: 1px solid var(--bordure);
    border-radius: var(--radius); padding: 1rem 1.2rem;
    display: flex; align-items: center; gap: 1rem;
    transition: border-color 0.15s;
}
.article:hover { border-color: #4a4a4a; }

/* Mini brique */
.mini-brique {
    width: 48px; height: 64px;
    border-radius: 10px 10px 6px 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
    position: relative; overflow: hidden;
}
.mini-img { position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: 0.35; }

/* Infos */
.article-infos {
    flex: 1; display: flex; flex-direction: column; gap: 0.2rem;
}
.article-infos strong { font-size: 0.95rem; }
.article-infos span { font-size: 0.82rem; color: var(--texte-doux); }
.texte-perso { font-style: italic; }

/* Quantité */
.qte { display: flex; align-items: center; gap: 0.5rem; }
.qte button {
    background: var(--fond); border: 1px solid var(--bordure);
    color: var(--texte); width: 28px; height: 28px;
    border-radius: 6px; font-size: 0.95rem; cursor: pointer;
    font-family: inherit; transition: background 0.15s;
}
.qte button:hover { background: var(--bordure); }
.qte span { font-size: 0.95rem; font-weight: 700; min-width: 20px; text-align: center; }

/* Prix */
.prix-article { color: var(--vert); font-weight: 700; min-width: 60px; text-align: right; }

/* Supprimer */
.btn-suppr {
    background: none; border: 1px solid #c0392b; color: #c0392b;
    width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
    font-size: 0.8rem; flex-shrink: 0; transition: background 0.15s;
}
.btn-suppr:hover { background: rgba(192,57,43,0.15); }

/* Récap */
.recap {
    background: var(--carte); border: 1px solid var(--bordure);
    border-radius: var(--radius); padding: 1.2rem;
    position: sticky; top: 80px;
}
.recap-ligne {
    display: flex; justify-content: space-between;
    padding: 0.4rem 0; font-size: 0.9rem; color: var(--texte-doux);
    border-bottom: 1px solid var(--bordure);
}
.recap-ligne:last-of-type { border-bottom: none; }
.recap-ligne.total { color: var(--texte); font-size: 1rem; font-weight: 700; }

.btn-commander {
    width: 100%; background: var(--vert); border: none; color: #fff;
    padding: 0.8rem; border-radius: var(--radius); font-size: 0.95rem;
    font-weight: 600; font-family: inherit; cursor: pointer;
    margin-top: 1rem; transition: background 0.15s;
}
.btn-commander:hover { background: var(--vert-hover); }

.msg-connexion { text-align: center; color: var(--texte-doux); font-size: 0.83rem; margin-top: 0.7rem; }
.msg-connexion span { color: var(--vert); cursor: pointer; text-decoration: underline; }
</style>
