<template>
    <div class="commandes">
        <button class="btn-retour" @click="$emit('naviguer', 'accueil')">← Retour à l'accueil</button>

        <h1>📦 Mes Commandes</h1>

        <div v-if="chargement" class="chargement">⏳ Chargement de vos commandes…</div>
        <div v-else-if="erreur" class="erreur">❌ {{ erreur }}</div>
        <div v-else-if="commandesGroupees.length === 0" class="vide">
            <span>📭</span>
            <p>Vous n'avez pas encore passé de commande.</p>
            <button class="btn-primary" @click="$emit('naviguer', 'boutique')">Commander maintenant</button>
        </div>

        <div v-else class="liste-commandes">
            <div class="commande-card" v-for="cmd in commandesGroupees" :key="cmd.idCom">
                <div class="cmd-header">
                    <div>
                        <span class="cmd-id">Commande #{{ cmd.idCom }}</span>
                        <span class="cmd-date">{{ formaterDate(cmd.date_commande) }}</span>
                    </div>
                    <span class="badge-etat" :class="classeEtat(cmd.etat)">{{ cmd.etat }}</span>
                </div>

                <div class="cmd-lignes">
                    <div class="cmd-ligne" v-for="(ligne, i) in cmd.lignes" :key="i">
                        <div class="mini-bouteille" :style="{ background: ligne.colorisEmb }">
                            <span>{{ emojiJus(ligne.nomJus) }}</span>
                        </div>
                        <div class="ligne-info">
                            <strong>{{ ligne.nomJus }}</strong>
                            <span>{{ ligne.nomEmb }} · {{ ligne.typeEmb }}</span>
                            <span v-if="ligne.texteEmb" class="texte-perso">💬 "{{ ligne.texteEmb }}"</span>
                        </div>
                        <div class="ligne-qte">× {{ ligne.qte }}</div>
                        <div class="ligne-prix">{{ calculerPrix(ligne) }} €</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageCommandes',
    props: {
        client: {
            type: Object,
            required: true
        }
    },
    emits: ['naviguer'],
    data() {
        return {
            commandes: [],
            chargement: true,
            erreur: null
        }
    },
    computed: {
        commandesGroupees() {
            const map = {}
            for (const ligne of this.commandes) {
                if (!map[ligne.idCom]) {
                    map[ligne.idCom] = {
                        idCom: ligne.idCom,
                        etat: ligne.etat,
                        date_commande: ligne.date_commande,
                        lignes: []
                    }
                }
                map[ligne.idCom].lignes.push(ligne)
            }
            return Object.values(map)
        }
    },
    methods: {
        chargerCommandes() {
            fetch(`http://localhost:3000/commandes/${this.client.idClient}`)
                .then(res => res.json())
                .then(data => {
                    if (data[0]) {
                        this.commandes = data[1]
                    } else {
                        this.erreur = 'Impossible de charger les commandes.'
                    }
                    this.chargement = false
                })
                .catch(() => {
                    this.erreur = 'Erreur de connexion au serveur.'
                    this.chargement = false
                })
        },
        formaterDate(d) {
            if (!d) return ''
            return new Date(d).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
        },
        classeEtat(etat) {
            if (!etat) return ''
            const e = etat.toLowerCase()
            if (e.includes('attente')) return 'attente'
            if (e.includes('expéd') || e.includes('exped')) return 'expedie'
            if (e.includes('livr')) return 'livre'
            return ''
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
        calculerPrix(ligne) {
            return ((parseFloat(ligne.prixUnitaire || 0) + parseFloat(ligne.prixEmb || 0)) * parseInt(ligne.qte || 1)).toFixed(2)
        }
    },
    mounted() {
        this.chargerCommandes()
    }
}
</script>

<style scoped>
.commandes {
    padding: 2rem 3rem;
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    color: #f3f3f3;
    max-width: 800px;
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

.chargement, .erreur { text-align: center; padding: 3rem; color: #aaa; }
.erreur { color: #ff6b6b; }

.vide {
    text-align: center;
    padding: 4rem;
    color: #aaa;
}
.vide span { font-size: 4rem; display: block; margin-bottom: 1rem; }
.vide p { font-size: 1.1rem; margin-bottom: 1.5rem; }
.btn-primary {
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 0.8rem 1.8rem;
    border-radius: 30px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
}

/* Commande card */
.liste-commandes { display: flex; flex-direction: column; gap: 1.5rem; }

.commande-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    overflow: hidden;
}

.cmd-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.07);
}
.cmd-id { font-weight: 700; font-size: 0.95rem; display: block; }
.cmd-date { font-size: 0.8rem; color: #888; }

.badge-etat {
    padding: 0.3rem 0.9rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}
.badge-etat.attente { background: rgba(255,193,7,0.2); color: #FFC107; border: 1px solid #FFC107; }
.badge-etat.expedie { background: rgba(33,150,243,0.2); color: #2196F3; border: 1px solid #2196F3; }
.badge-etat.livre { background: rgba(76,175,80,0.2); color: #4CAF50; border: 1px solid #4CAF50; }

.cmd-lignes { padding: 0.8rem 1.5rem; display: flex; flex-direction: column; gap: 0.8rem; }

.cmd-ligne {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.cmd-ligne:last-child { border-bottom: none; }

.mini-bouteille {
    width: 40px; height: 60px;
    border-radius: 14px 14px 8px 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.ligne-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.ligne-info strong { font-size: 0.9rem; }
.ligne-info span { font-size: 0.8rem; color: #aaa; }
.texte-perso { font-style: italic; }

.ligne-qte { color: #aaa; font-size: 0.9rem; min-width: 40px; text-align: center; }
.ligne-prix { color: #FF6B35; font-weight: 700; min-width: 60px; text-align: right; }
</style>
