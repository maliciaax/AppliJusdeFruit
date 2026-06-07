<template>
    <div class="commandes">
        <div class="entete">
            <h1>Mes commandes</h1>
            <button class="btn-retour" @click="$emit('naviguer', 'accueil')">← Retour</button>
        </div>

        <div v-if="chargement" class="message">Chargement…</div>
        <div v-else-if="erreur" class="message erreur">{{ erreur }}</div>

        <div v-else-if="commandesGroupees.length === 0" class="vide">
            <span>📭</span>
            <p>Vous n'avez pas encore passé de commande.</p>
            <button class="btn-vert" @click="$emit('naviguer', 'boutique')">Commander maintenant</button>
        </div>

        <div v-else class="liste">
            <div class="commande-card" v-for="cmd in commandesGroupees" :key="cmd.idCom">

                <!-- En-tête commande -->
                <div class="cmd-header">
                    <div>
                        <span class="cmd-id">Commande #{{ cmd.idCom }}</span>
                        <span class="cmd-date">{{ formaterDate(cmd.date_commande) }}</span>
                    </div>
                    <span class="badge" :class="classeEtat(cmd.etat)">{{ cmd.etat }}</span>
                </div>

                <!-- Lignes -->
                <div class="cmd-lignes">
                    <div class="cmd-ligne" v-for="(ligne, i) in cmd.lignes" :key="i">
                        <div class="mini-brique" :style="{ background: ligne.colorisEmb || '#4caf50' }">
                            {{ emojiJus(ligne.nomJus) }}
                        </div>
                        <div class="ligne-infos">
                            <strong>{{ ligne.nomJus }}</strong>
                            <span>{{ ligne.nomEmb }}</span>
                            <span v-if="ligne.texteEmb" class="texte-perso">"{{ ligne.texteEmb }}"</span>
                        </div>
                        <span class="ligne-qte">× {{ ligne.qte }}</span>
                        <span class="ligne-prix">{{ calculerPrix(ligne) }} €</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageCommandes',
    props: { client: { type: Object, required: true } },
    emits: ['naviguer'],
    data() {
        return { commandes: [], chargement: true, erreur: null }
    },
    computed: {
        commandesGroupees() {
            const map = {}
            for (const ligne of this.commandes) {
                if (!map[ligne.idCom]) {
                    map[ligne.idCom] = { idCom: ligne.idCom, etat: ligne.etat, date_commande: ligne.date_commande, lignes: [] }
                }
                map[ligne.idCom].lignes.push(ligne)
            }
            return Object.values(map)
        }
    },
    methods: {
        chargerCommandes() {
            fetch(`/commandes/${this.client.idClient}`)
                .then(res => res.json())
                .then(data => {
                    if (data[0]) { this.commandes = data[1] }
                    else { this.erreur = 'Impossible de charger les commandes.' }
                    this.chargement = false
                })
                .catch(() => { this.erreur = 'Erreur de connexion au serveur.'; this.chargement = false })
        },
        formaterDate(d) {
            if (!d) return ''
            return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        },
        classeEtat(etat) {
            const e = (etat || '').toLowerCase()
            if (e.includes('attente')) return 'attente'
            if (e.includes('expéd') || e.includes('exped')) return 'expedie'
            if (e.includes('livr')) return 'livre'
            return ''
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
        calculerPrix(ligne) {
            return ((parseFloat(ligne.prixUnitaire || 0) + parseFloat(ligne.prixEmb || 0)) * parseInt(ligne.qte || 1)).toFixed(2)
        }
    },
    mounted() { this.chargerCommandes() }
}
</script>

<style scoped>
.commandes { padding: 2rem; max-width: 800px; margin: 0 auto; }

.entete { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.entete h1 { font-size: 1.6rem; font-weight: 700; }

.btn-retour {
    background: none; border: 1px solid var(--bordure); color: var(--texte-doux);
    padding: 0.4rem 0.9rem; border-radius: 8px; cursor: pointer;
    font-family: inherit; font-size: 0.9rem; transition: border-color 0.15s, color 0.15s;
}
.btn-retour:hover { border-color: #666; color: var(--texte); }

.message { padding: 3rem; text-align: center; color: var(--texte-doux); }
.message.erreur { color: #e74c3c; }

.vide { text-align: center; padding: 5rem 2rem; color: var(--texte-doux); }
.vide span { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
.vide p { font-size: 1.05rem; margin-bottom: 1.5rem; }
.btn-vert {
    background: var(--vert); border: none; color: #fff;
    padding: 0.7rem 1.6rem; border-radius: var(--radius);
    font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer;
}
.btn-vert:hover { background: var(--vert-hover); }

.liste { display: flex; flex-direction: column; gap: 1rem; }

.commande-card {
    background: var(--carte); border: 1px solid var(--bordure);
    border-radius: var(--radius); overflow: hidden;
}

.cmd-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.9rem 1.2rem; border-bottom: 1px solid var(--bordure);
    background: rgba(255,255,255,0.02);
}
.cmd-id { font-weight: 700; font-size: 0.9rem; display: block; }
.cmd-date { font-size: 0.78rem; color: var(--texte-doux); }

/* Badges état */
.badge { padding: 0.25rem 0.8rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
.badge.attente  { background: rgba(241,196,15,0.15); color: #f1c40f; border: 1px solid #f1c40f; }
.badge.expedie  { background: rgba(52,152,219,0.15); color: #3498db; border: 1px solid #3498db; }
.badge.livre    { background: rgba(76,175,80,0.15);  color: var(--vert); border: 1px solid var(--vert); }

.cmd-lignes { padding: 0.8rem 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; }

.cmd-ligne {
    display: flex; align-items: center; gap: 0.9rem;
    padding-bottom: 0.7rem; border-bottom: 1px solid var(--bordure);
}
.cmd-ligne:last-child { border-bottom: none; padding-bottom: 0; }

.mini-brique {
    width: 38px; height: 52px; border-radius: 8px 8px 5px 5px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
}

.ligne-infos { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
.ligne-infos strong { font-size: 0.88rem; }
.ligne-infos span   { font-size: 0.78rem; color: var(--texte-doux); }
.texte-perso { font-style: italic; }

.ligne-qte  { color: var(--texte-doux); font-size: 0.85rem; min-width: 36px; text-align: center; }
.ligne-prix { color: var(--vert); font-weight: 700; font-size: 0.9rem; min-width: 55px; text-align: right; }
</style>
