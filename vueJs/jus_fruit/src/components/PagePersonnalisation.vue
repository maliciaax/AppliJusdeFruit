<template>
    <div class="perso">
        <button class="btn-retour" @click="$emit('naviguer', 'boutique')">← Retour à la boutique</button>

        <h1>🎨 Personnalise ta brique</h1>
        <p class="sous-titre">Tu as choisi : <strong>{{ jus.nomJus }}</strong> — {{ jus.prixUnitaire }} €</p>

        <div class="perso-container">

            <!-- ════════════════════════════════════════
                 COLONNE GAUCHE : les options
            ════════════════════════════════════════ -->
            <div class="formulaire">

                <!-- QUANTITÉ -->
                <div class="groupe">
                    <label>Quantité</label>
                    <div class="qte-controls">
                        <button @click="qte > 1 ? qte-- : null">−</button>
                        <span>{{ qte }}</span>
                        <button @click="qte++">+</button>
                    </div>
                </div>

                <!-- TAILLE DE LA BRIQUE -->
                <div class="groupe">
                    <label>Taille de la brique</label>
                    <div v-if="chargement" class="chargement">Chargement…</div>
                    <div v-else class="tailles-grid">
                        <!--
                            On boucle sur les emballages récupérés depuis la BDD.
                            Quand on clique sur une carte, elle devient "active"
                            grâce à la classe CSS conditionnelle :class="{ actif: ... }"
                        -->
                        <div
                            v-for="emb in listEmballages"
                            :key="emb.idEmb"
                            class="taille-card"
                            :class="{ actif: embSelectionne && embSelectionne.idEmb === emb.idEmb }"
                            @click="embSelectionne = emb"
                        >
                            <span class="taille-nom">{{ emb.nomEmb }}</span>
                            <span class="taille-prix">+ {{ emb.prixEmb }} €</span>
                        </div>
                    </div>
                </div>

                <!-- COULEUR -->
                <div class="groupe">
                    <label>Couleur de la brique</label>

                    <!-- Palette de couleurs rapides -->
                    <div class="couleurs-rapides">
                        <span
                            v-for="c in couleursRapides"
                            :key="c"
                            class="couleur-rond"
                            :class="{ actif: couleurChoisie === c }"
                            :style="{ background: c }"
                            @click="couleurChoisie = c"
                        ></span>
                    </div>

                    <!-- Ou choisir une couleur personnalisée -->
                    <div class="couleur-custom">
                        <input type="color" v-model="couleurChoisie" />
                        <span>Couleur personnalisée</span>
                    </div>
                </div>

                <!-- IMAGE (optionnel) -->
                <div class="groupe">
                    <label>Image sur la brique <span class="optionnel">(optionnel)</span></label>

                    <!-- Zone de dépôt / clic pour uploader une image -->
                    <div class="upload-zone" @click="$refs.inputImage.click()" @dragover.prevent @drop.prevent="onDrop">
                        <span v-if="!imagePreview">📁 Clique ou glisse une image ici</span>
                        <img v-else :src="imagePreview" class="img-preview" alt="Aperçu image" />
                    </div>

                    <!-- L'input file est caché, on le déclenche via le clic sur la zone au dessus -->
                    <input type="file" ref="inputImage" accept="image/*" style="display:none" @change="onImageChange" />

                    <button v-if="imagePreview" class="btn-suppr-img" @click="supprimerImage">
                        ✕ Supprimer l'image
                    </button>
                </div>

                <!-- TEXTE (optionnel) -->
                <div class="groupe">
                    <label>Texte sur la brique <span class="optionnel">(optionnel)</span></label>
                    <input
                        type="text"
                        v-model="textePersonnalise"
                        placeholder="Ex : Joyeux anniversaire Sophie ! 🎂"
                        maxlength="40"
                        class="input-texte"
                    />
                    <small>{{ textePersonnalise.length }}/40 caractères</small>
                </div>

                <!-- BOUTON AJOUTER AU PANIER -->
                <button
                    class="btn-panier"
                    :disabled="!embSelectionne"
                    @click="ajouterAuPanier"
                >
                    🛒 Ajouter au panier — {{ totalCalc }} €
                </button>

            </div>


            <!-- ════════════════════════════════════════
                 COLONNE DROITE : l'aperçu de la brique
            ════════════════════════════════════════ -->
            <div class="apercu">
                <h3>Aperçu</h3>

                <!--
                    La brique de jus est dessinée entièrement en CSS.
                    C'est un rectangle avec :
                    - un toit en trapèze (::before)
                    - un corps rectangulaire (le div lui-même)
                    La couleur change en temps réel grâce à v-bind:style
                -->
                <div class="brique-wrapper">

                    <!-- Toit de la brique -->
                    <div class="brique-toit" :style="{ borderBottomColor: couleurChoisie }"></div>

                    <!-- Corps de la brique -->
                    <div class="brique-corps" :style="{ background: couleurChoisie }">

                        <!-- Image en fond si l'utilisateur en a uploadé une -->
                        <img v-if="imagePreview" :src="imagePreview" class="brique-image-fond" alt="" />

                        <!-- Contenu au-dessus de l'image -->
                        <div class="brique-contenu">
                            <span class="brique-emoji">{{ emojiJus(jus.nomJus) }}</span>
                            <span class="brique-nom-jus">{{ jus.nomJus }}</span>
                            <span v-if="textePersonnalise" class="brique-texte">{{ textePersonnalise }}</span>
                            <span v-if="embSelectionne" class="brique-taille">{{ embSelectionne.nomEmb }}</span>
                        </div>

                    </div>

                    <!-- Bas de la brique (petite bande plus sombre) -->
                    <div class="brique-bas" :style="{ background: couleurFoncee }"></div>

                </div>

                <!-- Récapitulatif du prix -->
                <div class="recap-prix" v-if="embSelectionne">
                    <div class="ligne-prix">Jus <strong>{{ jus.prixUnitaire }} €</strong></div>
                    <div class="ligne-prix">Emballage <strong>{{ embSelectionne.prixEmb }} €</strong></div>
                    <div class="ligne-prix">Quantité <strong>× {{ qte }}</strong></div>
                    <div class="ligne-prix total">Total <strong>{{ totalCalc }} €</strong></div>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'PagePersonnalisation',

    // "props" = les données qu'on reçoit du composant parent (App.vue)
    props: {
        jus: {
            type: Object,
            required: true
        }
    },

    // "emits" = les événements qu'on envoie vers le parent
    emits: ['naviguer', 'ajouterPanier'],

    data() {
        return {
            // Liste des emballages récupérés depuis la BDD
            listEmballages: [],
            chargement: true,

            // L'emballage actuellement sélectionné
            embSelectionne: null,

            // Options de personnalisation
            couleurChoisie: '#FF6B35',
            imagePreview: null,       // URL de l'image uploadée (pour l'aperçu)
            imageFichier: null,       // Le vrai fichier image
            textePersonnalise: '',

            // Quantité commandée
            qte: 1,

            // Couleurs prédéfinies cliquables
            couleursRapides: [
                '#FF6B35', // orange
                '#e74c3c', // rouge
                '#e91e8c', // rose
                '#9b59b6', // violet
                '#3498db', // bleu
                '#2ecc71', // vert
                '#f39c12', // jaune
                '#1abc9c', // turquoise
            ]
        }
    },

    computed: {
        // Calcul du prix total (jus + emballage) × quantité
        totalCalc() {
            if (!this.embSelectionne) return '—'
            const prix = (parseFloat(this.jus.prixUnitaire) + parseFloat(this.embSelectionne.prixEmb)) * this.qte
            return prix.toFixed(2)
        },

        // Couleur un peu plus foncée pour le bas de la brique
        // On assombrit juste en ajoutant une transparence noire par dessus
        couleurFoncee() {
            return this.couleurChoisie + 'cc' // le "cc" rend la couleur semi-transparente
        }
    },

    methods: {

        // Récupère les emballages depuis le serveur Node
        chargerEmballages() {
            fetch('http://localhost:3000/emballages')
                .then(res => res.json())
                .then(data => {
                    if (data[0] === true) {
                        this.listEmballages = data[1]
                        // On sélectionne le premier emballage par défaut
                        this.embSelectionne = this.listEmballages[0]
                    }
                    this.chargement = false
                })
                .catch(() => {
                    this.chargement = false
                })
        },

        // Quand l'utilisateur choisit un fichier image via l'input
        onImageChange(e) {
            const file = e.target.files[0]
            if (!file) return
            this.imageFichier = file

            // FileReader lit le fichier et le convertit en URL pour l'afficher
            const reader = new FileReader()
            reader.onload = (ev) => {
                this.imagePreview = ev.target.result
            }
            reader.readAsDataURL(file)
        },

        // Quand l'utilisateur glisse-dépose une image
        onDrop(e) {
            const file = e.dataTransfer.files[0]
            if (!file || !file.type.startsWith('image/')) return
            this.imageFichier = file
            const reader = new FileReader()
            reader.onload = (ev) => { this.imagePreview = ev.target.result }
            reader.readAsDataURL(file)
        },

        // Supprime l'image uploadée
        supprimerImage() {
            this.imagePreview = null
            this.imageFichier = null
            if (this.$refs.inputImage) this.$refs.inputImage.value = ''
        },

        // Retourne l'emoji qui correspond au nom du jus
        emojiJus(nom) {
            const n = (nom || '').toLowerCase()
            if (n.includes('orange'))   return '🍊'
            if (n.includes('citron'))   return '🍋'
            if (n.includes('mangue'))   return '🥭'
            if (n.includes('ananas'))   return '🍍'
            if (n.includes('fraise'))   return '🍓'
            if (n.includes('framboise')) return '🍇'
            if (n.includes('myrtille')) return '🫐'
            if (n.includes('pastèque') || n.includes('pasteque')) return '🍉'
            if (n.includes('pomme'))    return '🍎'
            if (n.includes('poire'))    return '🍐'
            if (n.includes('pêche') || n.includes('peche')) return '🍑'
            if (n.includes('pamplemousse')) return '🍊'
            return '🥤'
        },

        // Envoie l'article vers le panier (via l'événement dans App.vue)
        ajouterAuPanier() {
            if (!this.embSelectionne) return

            const article = {
                jus: this.jus,
                emballage: {
                    ...this.embSelectionne,             // toutes les infos de l'emballage
                    colorisEmb: this.couleurChoisie,    // on remplace la couleur par celle choisie
                    texteEmb: this.textePersonnalise,   // le texte personnalisé
                    imagePreview: this.imagePreview     // l'image uploadée
                },
                qte: this.qte,
                total: this.totalCalc
            }

            // On envoie l'article au composant parent App.vue
            this.$emit('ajouterPanier', article)
        }
    },

    // mounted() = s'exécute quand le composant est chargé dans la page
    mounted() {
        this.chargerEmballages()
    }
}
</script>


<style scoped>

/* ── PAGE ── */
.perso {
    padding: 2rem 3rem;
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    color: #f3f3f3;
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

.perso h1 { font-size: 2rem; margin-bottom: 0.4rem; }
.sous-titre { color: #aaa; margin-bottom: 2rem; }

/* ── LAYOUT 2 COLONNES ── */
.perso-container {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 3rem;
    align-items: start;
}

/* ── FORMULAIRE ── */
.groupe {
    margin-bottom: 1.8rem;
}
.groupe label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.6rem;
    font-size: 0.95rem;
    color: #ddd;
}
.optionnel {
    font-weight: 400;
    color: #888;
    font-size: 0.85rem;
}

/* Quantité */
.qte-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.qte-controls button {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.2s;
}
.qte-controls button:hover { background: #FF6B35; border-color: #FF6B35; }
.qte-controls span { font-size: 1.3rem; font-weight: 700; min-width: 30px; text-align: center; }

/* Tailles */
.tailles-grid {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
}
.taille-card {
    background: rgba(255,255,255,0.05);
    border: 2px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 0.7rem 1.2rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    transition: border-color 0.2s, background 0.2s;
}
.taille-card.actif {
    border-color: #FF6B35;
    background: rgba(255, 107, 53, 0.15);
}
.taille-nom { font-size: 0.9rem; color: #ddd; font-weight: 600; }
.taille-prix { font-size: 0.82rem; color: #FF6B35; }

/* Couleurs */
.couleurs-rapides {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
}
.couleur-rond {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: transform 0.15s, border-color 0.15s;
}
.couleur-rond:hover { transform: scale(1.15); }
.couleur-rond.actif { border-color: #fff; transform: scale(1.1); }

.couleur-custom {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #aaa;
    font-size: 0.9rem;
}
.couleur-custom input[type="color"] {
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 8px;
}

/* Upload image */
.upload-zone {
    border: 2px dashed rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    color: #aaa;
    transition: border-color 0.2s, color 0.2s;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.upload-zone:hover { border-color: #FF6B35; color: #FF6B35; }
.img-preview { max-height: 160px; max-width: 100%; border-radius: 8px; }

.btn-suppr-img {
    background: none;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    padding: 0.3rem 0.8rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 0.5rem;
    font-size: 0.85rem;
}
.btn-suppr-img:hover { background: rgba(255,107,107,0.15); }

/* Texte */
.input-texte {
    width: 100%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 0.7rem 1rem;
    color: #fff;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s;
}
.input-texte:focus { outline: none; border-color: #FF6B35; }
small { color: #888; font-size: 0.8rem; }

/* Bouton panier */
.btn-panier {
    width: 100%;
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 1rem 2rem;
    border-radius: 14px;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
}
.btn-panier:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,107,53,0.5); }
.btn-panier:disabled { opacity: 0.4; cursor: not-allowed; }

/* ────────────────────────────────────────────
   APERÇU DE LA BRIQUE DE JUS
   C'est un dessin CSS simple :
   - .brique-toit  : le triangle du haut (comme une vraie brique de lait)
   - .brique-corps : le rectangle principal
   - .brique-bas   : la bande du bas
──────────────────────────────────────────── */

.apercu {
    position: sticky;
    top: 100px;
    text-align: center;
}
.apercu h3 {
    margin-bottom: 1.5rem;
    font-size: 1rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.brique-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    /* Ombre portée pour donner du relief */
    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.5));
}

/* Le toit en triangle : on utilise l'astuce des bordures CSS */
.brique-toit {
    width: 0;
    height: 0;
    /* Bordure gauche et droite transparentes = effet triangle */
    border-left: 75px solid transparent;
    border-right: 75px solid transparent;
    /* La bordure du bas est colorée = ça fait le triangle visible */
    border-bottom: 30px solid #FF6B35;   /* la couleur est mise à jour via v-bind:style */
    transition: border-bottom-color 0.3s;
}

/* Le corps rectangulaire de la brique */
.brique-corps {
    width: 150px;
    height: 220px;
    position: relative;
    overflow: hidden;           /* pour que l'image ne dépasse pas */
    transition: background 0.3s;
}

/* L'image en fond semi-transparente */
.brique-image-fond {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.35;              /* on la rend transparente pour voir la couleur */
}

/* Le texte et emoji par-dessus */
.brique-contenu {
    position: relative;         /* z-index > image de fond */
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0.5rem;
}

.brique-emoji { font-size: 3rem; }

.brique-nom-jus {
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0,0,0,0.7);
}

.brique-texte {
    font-size: 0.6rem;
    color: rgba(255,255,255,0.9);
    text-align: center;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    font-style: italic;
    word-break: break-word;
    padding: 0 4px;
}

.brique-taille {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.7);
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    margin-top: 4px;
}

/* La bande du bas */
.brique-bas {
    width: 150px;
    height: 14px;
    transition: background 0.3s;
}

/* ── RÉCAP PRIX ── */
.recap-prix {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    text-align: left;
}
.ligne-prix {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0;
    font-size: 0.9rem;
    color: #ccc;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.ligne-prix:last-child { border-bottom: none; }
.ligne-prix.total {
    color: #FF6B35;
    font-size: 1.05rem;
    font-weight: 700;
    margin-top: 0.3rem;
}

.chargement { color: #aaa; font-size: 0.9rem; }

</style>