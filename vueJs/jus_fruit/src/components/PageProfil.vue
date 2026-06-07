<template>
    <div class="profil-page">

        <!-- Chargement -->
        <div v-if="chargement" class="etat-centre">
            <div class="spinner"></div>
            <p>Chargement du profil…</p>
        </div>

        <!-- Erreur -->
        <div v-else-if="erreur" class="etat-centre">
            <p class="erreur-msg">{{ erreur }}</p>
        </div>

        <!-- Contenu -->
        <template v-else-if="profil">

            <!-- En-tête -->
            <div class="profil-header">
                <div class="avatar">{{ initiales }}</div>
                <div>
                    <h1>{{ profil.prenomClient }} {{ profil.nomClient }}</h1>
                    <p class="sous-titre">Mon compte</p>
                </div>
            </div>

            <!-- Fiche infos -->
            <section class="carte">
                <h2>Mes informations</h2>
                <div class="grille-infos">
                    <div class="champ">
                        <span class="label">Prénom</span>
                        <span class="valeur">{{ profil.prenomClient }}</span>
                    </div>
                    <div class="champ">
                        <span class="label">Nom</span>
                        <span class="valeur">{{ profil.nomClient }}</span>
                    </div>
                    <div class="champ">
                        <span class="label">E-mail</span>
                        <span class="valeur">{{ profil.mailClient }}</span>
                    </div>
                    <div class="champ">
                        <span class="label">Téléphone</span>
                        <span class="valeur">{{ profil.numClient || '—' }}</span>
                    </div>
                    <div class="champ champ-large">
                        <span class="label">Adresse</span>
                        <span class="valeur">{{ profil.adresseClient || '—' }}</span>
                    </div>
                    <div class="champ">
                        <span class="label">Code postal</span>
                        <span class="valeur">{{ profil.cdpClient || '—' }}</span>
                    </div>
                </div>
            </section>

            <!-- Zone danger -->
            <section class="carte carte-danger">
                <h2>⚠️ Zone sensible</h2>
                <p class="danger-desc">
                    La suppression de votre compte est <strong>définitive</strong>.
                    Toutes vos commandes et données personnelles seront effacées de notre base.
                </p>

                <!-- Étape 1 : bouton d'amorce -->
                <button v-if="!confirmerSuppression" class="btn-danger" @click="confirmerSuppression = true">
                    Supprimer mon compte
                </button>

                <!-- Étape 2 : confirmation -->
                <div v-else class="confirmation-bloc">
                    <p class="confirmation-texte">Êtes-vous sûr(e) ? Cette action est irréversible.</p>
                    <div class="confirmation-actions">
                        <button class="btn-annuler" @click="confirmerSuppression = false">Annuler</button>
                        <button class="btn-danger" :disabled="suppression" @click="supprimerCompte">
                            {{ suppression ? 'Suppression…' : 'Oui, supprimer définitivement' }}
                        </button>
                    </div>
                </div>
            </section>

        </template>

    </div>
</template>

<script>
export default {
    name: 'PageProfil',
    props: {
        client: { type: Object, required: true }
    },
    emits: ['naviguer', 'compteSuprime'],
    data() {
        return {
            profil: null,
            chargement: true,
            erreur: null,
            confirmerSuppression: false,
            suppression: false
        }
    },
    computed: {
        initiales() {
            if (!this.profil) return '?'
            return (this.profil.prenomClient?.[0] || '') + (this.profil.nomClient?.[0] || '')
        }
    },
    mounted() {
        this.chargerProfil()
    },
    methods: {
        async chargerProfil() {
            this.chargement = true
            this.erreur = null
            try {
                const res = await fetch(`/client/${this.client.idClient}`)
                const data = await res.json()
                if (data[0]) {
                    this.profil = data[1]
                } else {
                    this.erreur = 'Impossible de charger le profil.'
                }
            } catch {
                this.erreur = 'Erreur de connexion au serveur.'
            } finally {
                this.chargement = false
            }
        },
        async supprimerCompte() {
            this.suppression = true
            try {
                const res = await fetch(`/client/${this.client.idClient}`, {
                    method: 'DELETE'
                })
                const data = await res.json()
                if (data[0]) {
                    this.$emit('compteSuprime')
                } else {
                    alert('Erreur lors de la suppression : ' + (data[1] || 'inconnue'))
                    this.suppression = false
                    this.confirmerSuppression = false
                }
            } catch {
                alert('Erreur de connexion au serveur.')
                this.suppression = false
            }
        }
    }
}
</script>

<style scoped>
.profil-page {
    max-width: 720px;
    margin: 2.5rem auto;
    padding: 0 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* États chargement / erreur */
.etat-centre {
    text-align: center;
    padding: 4rem 0;
    color: var(--texte-doux);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
.erreur-msg { color: #e57373; }

.spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--bordure);
    border-top-color: var(--vert);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Header profil */
.profil-header {
    display: flex;
    align-items: center;
    gap: 1.2rem;
}
.avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--vert);
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    text-transform: uppercase;
}
.profil-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--texte);
}
.sous-titre {
    color: var(--texte-doux);
    font-size: 0.9rem;
    margin-top: 0.2rem;
}

/* Cartes */
.carte {
    background: var(--carte);
    border: 1px solid var(--bordure);
    border-radius: var(--radius);
    padding: 1.5rem;
}
.carte h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--texte-doux);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 1.2rem;
}

/* Grille infos */
.grille-infos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}
.champ-large { grid-column: 1 / -1; }

.champ {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.label {
    font-size: 0.78rem;
    color: var(--texte-doux);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.valeur {
    font-size: 1rem;
    color: var(--texte);
    font-weight: 500;
}

/* Zone danger */
.carte-danger {
    border-color: #5a2020;
}
.carte-danger h2 { color: #e57373; }

.danger-desc {
    color: var(--texte-doux);
    font-size: 0.92rem;
    line-height: 1.55;
    margin-bottom: 1.2rem;
}
.danger-desc strong { color: var(--texte); }

/* Boutons */
.btn-danger {
    background: #7f1d1d;
    border: 1px solid #b91c1c;
    color: #fca5a5;
    padding: 0.55rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    font-weight: 600;
    transition: background 0.15s;
}
.btn-danger:hover:not(:disabled) { background: #991b1b; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.confirmation-bloc {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}
.confirmation-texte {
    color: #fca5a5;
    font-size: 0.92rem;
}
.confirmation-actions {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
}
.btn-annuler {
    background: var(--carte);
    border: 1px solid var(--bordure);
    color: var(--texte);
    padding: 0.55rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    transition: background 0.15s;
}
.btn-annuler:hover { background: var(--bordure); }
</style>
