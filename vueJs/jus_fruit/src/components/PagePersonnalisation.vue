<template>
    <div class="perso">
        <button class="btn-retour" @click="$emit('naviguer', 'boutique')">← Retour</button>

        <div class="perso-container">

            <!-- COLONNE GAUCHE : formulaire -->
            <div class="formulaire">
                <h1>Personnalise ta brique</h1>
                <p class="sous-titre">{{ jus.nomJus }} — <strong>{{ jus.prixUnitaire }} €</strong></p>

                <!-- TAILLE -->
                <div class="groupe">
                    <label>Taille</label>
                    <div v-if="chargement" class="message-chargement">Chargement…</div>
                    <div v-else class="tailles">
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

                <!-- QUANTITÉ -->
                <div class="groupe">
                    <label>Quantité</label>
                    <div class="qte">
                        <button @click="qte > 1 ? qte-- : null">−</button>
                        <span>{{ qte }}</span>
                        <button @click="qte++">+</button>
                    </div>
                </div>

                <!-- COULEUR -->
                <div class="groupe">
                    <label>Couleur</label>
                    <div class="couleurs">
                        <span
                            v-for="c in couleursRapides" :key="c"
                            class="couleur-rond"
                            :class="{ actif: couleurChoisie === c }"
                            :style="{ background: c }"
                            @click="couleurChoisie = c"
                        ></span>
                        <!-- Color picker pour couleur libre -->
                        <label class="couleur-custom" title="Couleur personnalisée">
                            <input type="color" v-model="couleurChoisie" />
                            <span class="couleur-rond" :style="{ background: couleurChoisie }">＋</span>
                        </label>
                    </div>
                </div>

                <!-- IMAGE -->
                <div class="groupe">
                    <label>Image <span class="optionnel">(optionnel)</span></label>
                    <div class="upload-zone" @click="$refs.inputImage.click()" @dragover.prevent @drop.prevent="onDrop">
                        <span v-if="!imagePreview">📁 Cliquer ou glisser une image</span>
                        <img v-else :src="imagePreview" alt="Aperçu" />
                    </div>
                    <input type="file" ref="inputImage" accept="image/*" style="display:none" @change="onImageChange" />
                    <button v-if="imagePreview" class="btn-suppr" @click="supprimerImage">✕ Supprimer</button>
                </div>

                <!-- TEXTE -->
                <div class="groupe">
                    <label>Texte <span class="optionnel">(optionnel)</span></label>
                    <input type="text" v-model="textePersonnalise" placeholder="Ex : Joyeux anniversaire ! 🎂" maxlength="40" class="input-texte" />
                    <small>{{ textePersonnalise.length }}/40</small>
                </div>

                <!-- BOUTON -->
                <button class="btn-panier" :disabled="!embSelectionne" @click="ajouterAuPanier">
                    🛒 Ajouter au panier — {{ totalCalc }} €
                </button>
            </div>

            <!-- COLONNE DROITE : aperçu brique -->
            <div class="apercu">
                <p class="label-apercu">Aperçu</p>

                <!-- La brique dessinée en CSS -->
                <div class="brique-wrapper">
                    <!-- Toit triangulaire (astuce bordures CSS) -->
                    <div class="brique-toit" :style="{ borderBottomColor: couleurChoisie }"></div>
                    <!-- Corps rectangulaire -->
                    <div class="brique-corps" :style="{ background: couleurChoisie }">
                        <!-- Image en fond si uploadée -->
                        <img v-if="imagePreview" :src="imagePreview" class="brique-img-fond" alt="" />
                        <!-- Contenu -->
                        <div class="brique-contenu">
                            <span class="brique-emoji">{{ emojiJus(jus.nomJus) }}</span>
                            <span class="brique-nom">{{ jus.nomJus }}</span>
                            <span v-if="textePersonnalise" class="brique-texte">{{ textePersonnalise }}</span>
                            <span v-if="embSelectionne" class="brique-taille">{{ embSelectionne.nomEmb }}</span>
                        </div>
                    </div>
                    <!-- Bas de la brique -->
                    <div class="brique-bas" :style="{ background: couleurChoisie, filter: 'brightness(0.7)' }"></div>
                </div>

                <!-- Récap prix -->
                <div class="recap" v-if="embSelectionne">
                    <div class="recap-ligne">Jus          <strong>{{ jus.prixUnitaire }} €</strong></div>
                    <div class="recap-ligne">Emballage    <strong>{{ embSelectionne.prixEmb }} €</strong></div>
                    <div class="recap-ligne">Quantité     <strong>× {{ qte }}</strong></div>
                    <div class="recap-ligne total">Total  <strong>{{ totalCalc }} €</strong></div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'PagePersonnalisation',
    props: { jus: { type: Object, required: true } },
    emits: ['naviguer', 'ajouterPanier'],
    data() {
        return {
            listEmballages: [],
            chargement: true,
            embSelectionne: null,
            couleurChoisie: '#4caf50',
            imagePreview: null,
            imageFichier: null,
            textePersonnalise: '',
            qte: 1,
            couleursRapides: ['#4caf50','#e74c3c','#e91e8c','#9b59b6','#3498db','#f39c12','#1abc9c','#ffffff']
        }
    },
    computed: {
        totalCalc() {
            if (!this.embSelectionne) return '—'
            return ((parseFloat(this.jus.prixUnitaire) + parseFloat(this.embSelectionne.prixEmb)) * this.qte).toFixed(2)
        }
    },
    methods: {
        chargerEmballages() {
            fetch('http://localhost:3000/emballages')
                .then(res => res.json())
                .then(data => {
                    if (data[0] === true) {
                        this.listEmballages = data[1]
                        this.embSelectionne = this.listEmballages[0]
                    }
                    this.chargement = false
                })
                .catch(() => { this.chargement = false })
        },
        onImageChange(e) {
            const file = e.target.files[0]
            if (!file) return
            this.imageFichier = file
            const reader = new FileReader()
            reader.onload = ev => { this.imagePreview = ev.target.result }
            reader.readAsDataURL(file)
        },
        onDrop(e) {
            const file = e.dataTransfer.files[0]
            if (!file || !file.type.startsWith('image/')) return
            this.imageFichier = file
            const reader = new FileReader()
            reader.onload = ev => { this.imagePreview = ev.target.result }
            reader.readAsDataURL(file)
        },
        supprimerImage() {
            this.imagePreview = null
            this.imageFichier = null
            if (this.$refs.inputImage) this.$refs.inputImage.value = ''
        },
        emojiJus(nom) {
            const n = (nom || '').toLowerCase()
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
        },
        ajouterAuPanier() {
            if (!this.embSelectionne) return
            this.$emit('ajouterPanier', {
                jus: this.jus,
                emballage: { ...this.embSelectionne, colorisEmb: this.couleurChoisie, texteEmb: this.textePersonnalise, imagePreview: this.imagePreview },
                qte: this.qte,
                total: this.totalCalc
            })
        }
    },
    mounted() { this.chargerEmballages() }
}
</script>

<style scoped>
.perso { padding: 1.5rem 2rem; max-width: 1000px; margin: 0 auto; }

.btn-retour {
    background: none; border: 1px solid var(--bordure);
    color: var(--texte-doux); padding: 0.4rem 0.9rem;
    border-radius: 8px; cursor: pointer; font-family: inherit;
    font-size: 0.9rem; margin-bottom: 1.5rem; transition: border-color 0.15s, color 0.15s;
}
.btn-retour:hover { border-color: #666; color: var(--texte); }

/* Layout 2 colonnes */
.perso-container { display: grid; grid-template-columns: 1fr 280px; gap: 3rem; align-items: start; }

/* FORMULAIRE */
h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.3rem; }
.sous-titre { color: var(--texte-doux); font-size: 0.95rem; margin-bottom: 1.8rem; }

.groupe { margin-bottom: 1.5rem; }
.groupe label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.6rem; color: #ccc; }
.optionnel { font-weight: 400; color: var(--texte-doux); font-size: 0.82rem; }

/* Tailles */
.tailles { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.taille-card {
    background: var(--carte); border: 1px solid var(--bordure);
    border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    transition: border-color 0.15s;
}
.taille-card.actif { border-color: var(--vert); background: rgba(76,175,80,0.1); }
.taille-nom { font-size: 0.85rem; font-weight: 600; }
.taille-prix { font-size: 0.78rem; color: var(--vert); }

/* Quantité */
.qte { display: flex; align-items: center; gap: 0.8rem; }
.qte button {
    background: var(--carte); border: 1px solid var(--bordure);
    color: var(--texte); width: 32px; height: 32px; border-radius: 8px;
    font-size: 1rem; cursor: pointer; font-family: inherit; transition: background 0.15s;
}
.qte button:hover { background: var(--bordure); }
.qte span { font-size: 1.1rem; font-weight: 700; min-width: 24px; text-align: center; }

/* Couleurs */
.couleurs { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.couleur-rond {
    width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
    border: 2px solid transparent; transition: transform 0.15s, border-color 0.15s;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: rgba(0,0,0,0.5); font-weight: 700;
}
.couleur-rond:hover { transform: scale(1.15); }
.couleur-rond.actif { border-color: #fff; }
.couleur-custom { cursor: pointer; }
.couleur-custom input[type="color"] { display: none; }

/* Upload */
.upload-zone {
    border: 1px dashed var(--bordure); border-radius: 8px; padding: 1.2rem;
    text-align: center; cursor: pointer; color: var(--texte-doux);
    font-size: 0.9rem; transition: border-color 0.15s;
    display: flex; align-items: center; justify-content: center; min-height: 80px;
}
.upload-zone:hover { border-color: var(--vert); color: var(--vert); }
.upload-zone img { max-height: 140px; max-width: 100%; border-radius: 6px; }
.btn-suppr {
    background: none; border: 1px solid #e74c3c; color: #e74c3c;
    padding: 0.3rem 0.7rem; border-radius: 6px; cursor: pointer;
    font-size: 0.82rem; margin-top: 0.5rem; font-family: inherit;
}

/* Texte */
.input-texte {
    width: 100%; background: var(--carte); border: 1px solid var(--bordure);
    border-radius: 8px; padding: 0.6rem 0.9rem; color: var(--texte);
    font-size: 0.95rem; font-family: inherit; box-sizing: border-box;
    transition: border-color 0.15s;
}
.input-texte:focus { outline: none; border-color: var(--vert); }
small { color: var(--texte-doux); font-size: 0.78rem; }

/* Bouton panier */
.btn-panier {
    width: 100%; background: var(--vert); border: none; color: #fff;
    padding: 0.85rem; border-radius: var(--radius); font-size: 1rem;
    font-weight: 600; font-family: inherit; cursor: pointer; transition: background 0.15s;
}
.btn-panier:hover:not(:disabled) { background: var(--vert-hover); }
.btn-panier:disabled { opacity: 0.4; cursor: not-allowed; }

/* ─── BRIQUE CSS ─── */
.apercu { position: sticky; top: 80px; text-align: center; }
.label-apercu { color: var(--texte-doux); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.2rem; }

.brique-wrapper {
    display: inline-flex; flex-direction: column; align-items: center;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5));
}

/* Triangle du haut — astuce : border transparentes + border-bottom colorée */
.brique-toit {
    width: 0; height: 0;
    border-left: 70px solid transparent;
    border-right: 70px solid transparent;
    border-bottom: 28px solid #4caf50; /* mis à jour via :style */
    transition: border-bottom-color 0.25s;
}

/* Corps rectangulaire */
.brique-corps {
    width: 140px; height: 200px;
    position: relative; overflow: hidden;
    transition: background 0.25s;
}

/* Image de fond semi-transparente */
.brique-img-fond {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover; opacity: 0.3;
}

/* Texte par-dessus */
.brique-contenu {
    position: relative; z-index: 1; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 5px; padding: 0.5rem;
}
.brique-emoji { font-size: 2.8rem; }
.brique-nom   { font-size: 0.7rem; font-weight: 700; color: #fff; text-align: center; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
.brique-texte { font-size: 0.58rem; color: rgba(255,255,255,0.9); text-align: center; font-style: italic; word-break: break-word; text-shadow: 0 1px 3px rgba(0,0,0,0.7); }
.brique-taille { font-size: 0.62rem; color: rgba(255,255,255,0.7); text-shadow: 0 1px 3px rgba(0,0,0,0.7); }

/* Bas de la brique */
.brique-bas { width: 140px; height: 12px; transition: background 0.25s; }

/* Récap */
.recap { background: var(--carte); border: 1px solid var(--bordure); border-radius: var(--radius); padding: 1rem; text-align: left; }
.recap-ligne { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.88rem; color: var(--texte-doux); border-bottom: 1px solid var(--bordure); }
.recap-ligne:last-child { border-bottom: none; }
.recap-ligne.total { color: var(--vert); font-size: 1rem; font-weight: 700; }
.message-chargement { color: var(--texte-doux); font-size: 0.9rem; }
</style>
