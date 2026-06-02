<template>
    <div class="panier">
        <button class="btn-retour" @click="$emit('naviguer', 'boutique')">← Continuer mes achats</button>

        <h1>🛒 Mon Panier</h1>

        <div v-if="panier.length === 0" class="vide">
            <span>🛒</span>
            <p>Votre panier est vide.</p>
            <button class="btn-primary" @click="$emit('naviguer', 'boutique')">Découvrir nos jus</button>
        </div>

        <div v-else>
            <div class="liste-articles">
                <div class="article" v-for="(article, index) in panier" :key="index">
                    <!-- Aperçu miniature -->
                    <div class="mini-bouteille" :style="{ background: article.emballage.colorisEmb }">
                        <img v-if="article.emballage.imagePreview" :src="article.emballage.imagePreview" class="mini-img" />
                        <span class="mini-emoji">{{ emojiJus(article.jus.nomJus) }}</span>
                        <span v-if="article.emballage.texteEmb" class="mini-texte">{{ article.emballage.texteEmb }}</span>
                    </div>

                    <!-- Infos -->
                    <div class="article-info">
                        <h3>{{ article.jus.nomJus }}</h3>
                        <p class="emb-detail">
                            {{ article.emballage.nomEmb }} · 
                            <span class="couleur-dot" :style="{ background: article.emballage.colorisEmb }"></span>
                            {{ article.emballage.colorisEmb }}
                        </p>
                        <p v-if="article.emballage.texteEmb" class="texte-perso">💬 "{{ article.emballage.texteEmb }}"</p>
                        <p v-if="article.emballage.imagePreview" class="texte-perso">🖼️ Image personnalisée ajoutée</p>
                    </div>

                    <!-- Quantité & Prix -->
                    <div class="article-qte">
                        <div class="qte-controls">
                            <button @click="diminuerQte(index)">−</button>
                            <span>{{ article.qte }}</span>
                            <button @click="augmenterQte(index)">+</button>
                        </div>
                        <div class="prix-article">{{ calculerPrixArticle(article) }} €</div>
                    </div>

                    <!-- Supprimer -->
                    <button class="btn-suppr" @click="$emit('supprimerArticle', index)" title="Supprimer">✕</button>
                </div>
            </div>

            <!-- Récap total -->
            <div class="recap-total">
                <div class="ligne">Sous-total ({{ nbArticles }} article{{ nbArticles > 1 ? 's' : '' }}) <strong>{{ sousTotal }} €</strong></div>
                <div class="ligne">Livraison <strong>Offerte 🎉</strong></div>
                <div class="ligne total">Total <strong>{{ sousTotal }} €</strong></div>
                <button class="btn-commander" @click="commander">
                    ✅ Passer la commande
                </button>
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
        panier: {
            type: Array,
            required: true
        },
        client: {
            type: Object,
            default: null
        }
    },
    emits: ['naviguer', 'supprimerArticle', 'mettreAJourQte', 'commander'],
    computed: {
        nbArticles() {
            return this.panier.reduce((s, a) => s + a.qte, 0)
        },
        sousTotal() {
            return this.panier.reduce((s, a) => {
                return s + (parseFloat(a.jus.prixUnitaire) + parseFloat(a.emballage.prixEmb)) * a.qte
            }, 0).toFixed(2)
        }
    },
    methods: {
        calculerPrixArticle(article) {
            return ((parseFloat(article.jus.prixUnitaire) + parseFloat(article.emballage.prixEmb)) * article.qte).toFixed(2)
        },
        emojiJus(nom) {
            const n = (nom || '').toLowerCase()
            if (n.includes('orange')) return '🍊'
            if (n.includes('mangue')) return '🥭'
            if (n.includes('ananas')) return '🍍'
            if (n.includes('fraise')) return '🍓'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
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
            if (!this.client) {
                this.$emit('naviguer', 'connexion')
                return
            }
            this.$emit('commander')
        }
    }
}
</script>

<style scoped>
.panier {
    padding: 2rem 3rem;
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    color: #f3f3f3;
    max-width: 900px;
    margin: 0 auto;
}

.btn-retour {
    background: none;
    border: 1px solid rgba(255,255,255,0.2);
    color: #aaa;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: color 0.2s, border-color 0.2s;
}
.btn-retour:hover { color: #FF6B35; border-color: #FF6B35; }

h1 { font-size: 2rem; margin-bottom: 2rem; }

/* PANIER VIDE */
.vide {
    text-align: center;
    padding: 4rem;
    color: #aaa;
}
.vide span { font-size: 5rem; display: block; margin-bottom: 1rem; }
.vide p { font-size: 1.2rem; margin-bottom: 1.5rem; }
.btn-primary {
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); }

/* LISTE ARTICLES */
.liste-articles { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }

.article {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: border-color 0.2s;
}
.article:hover { border-color: rgba(255,107,53,0.4); }

/* Mini bouteille */
.mini-bouteille {
    width: 64px;
    height: 100px;
    border-radius: 24px 24px 14px 14px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}
.mini-img {
    position: absolute;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.45;
}
.mini-emoji { font-size: 1.6rem; z-index: 1; }
.mini-texte {
    z-index: 1;
    font-size: 0.45rem;
    color: #fff;
    text-align: center;
    padding: 0 4px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.9);
    word-break: break-word;
    max-width: 58px;
}

/* Infos article */
.article-info { flex: 1; }
.article-info h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; }
.emb-detail {
    font-size: 0.85rem;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.3rem;
}
.couleur-dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    display: inline-block;
    border: 1px solid rgba(255,255,255,0.3);
}
.texte-perso { font-size: 0.82rem; color: #aaa; font-style: italic; }

/* Quantité & prix */
.article-qte {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 90px;
}
.qte-controls {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}
.qte-controls button {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 28px; height: 28px;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    line-height: 1;
}
.qte-controls button:hover { background: #FF6B35; border-color: #FF6B35; }
.qte-controls span { font-size: 1rem; font-weight: 700; min-width: 20px; text-align: center; }
.prix-article { color: #FF6B35; font-weight: 700; font-size: 1rem; }

/* Supprimer */
.btn-suppr {
    background: none;
    border: 1px solid rgba(255,107,107,0.3);
    color: #ff6b6b;
    width: 32px; height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.2s;
    flex-shrink: 0;
}
.btn-suppr:hover { background: rgba(255,107,107,0.15); }

/* RÉCAP TOTAL */
.recap-total {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    max-width: 400px;
    margin-left: auto;
}
.ligne {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    font-size: 0.95rem;
    color: #ccc;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.ligne:last-of-type { border-bottom: none; }
.ligne.total {
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin-top: 0.4rem;
}
.btn-commander {
    width: 100%;
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 0.9rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 1.2rem;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(255,107,53,0.4);
}
.btn-commander:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,107,53,0.5); }

.msg-connexion {
    text-align: center;
    color: #aaa;
    font-size: 0.85rem;
    margin-top: 0.7rem;
}
.msg-connexion span {
    color: #FF6B35;
    cursor: pointer;
    text-decoration: underline;
}
</style>
