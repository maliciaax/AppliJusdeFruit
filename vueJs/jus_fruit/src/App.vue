<template>
    <div id="app">
        <!-- Navbar (toujours visible sauf sur auth) -->
        <NavBar
            v-if="pageCourante !== 'connexion' && pageCourante !== 'inscription'"
            :client="clientConnecte"
            @naviguer="naviguer"
            @deconnexion="deconnecter"
        />

        <!-- Badge panier flottant -->
        <div
            v-if="panier.length > 0 && pageCourante !== 'panier'"
            class="badge-panier-flottant"
            @click="naviguer('panier')"
            title="Voir mon panier"
        >
            🛒 <span>{{ nbArticlesPanier }}</span>
        </div>

        <!-- Pages -->
        <PageAccueil
            v-if="pageCourante === 'accueil'"
            @naviguer="naviguer"
        />

        <PageBoutique
            v-else-if="pageCourante === 'boutique'"
            @selectionnerJus="ouvrirPersonnalisation"
        />

        <PagePersonnalisation
            v-else-if="pageCourante === 'personnalisation' && jusSelectionne"
            :jus="jusSelectionne"
            @naviguer="naviguer"
            @ajouterPanier="ajouterAuPanier"
        />

        <PagePanier
            v-else-if="pageCourante === 'panier'"
            :panier="panier"
            :client="clientConnecte"
            @naviguer="naviguer"
            @supprimerArticle="supprimerArticle"
            @mettreAJourQte="mettreAJourQte"
            @commander="passerCommande"
        />

        <PageAuth
            v-else-if="pageCourante === 'connexion' || pageCourante === 'inscription'"
            :modeInitial="pageCourante"
            @naviguer="naviguer"
            @connexionReussie="connecterClient"
        />

        <PageCommandes
            v-else-if="pageCourante === 'mesCommandes' && clientConnecte"
            :client="clientConnecte"
            @naviguer="naviguer"
        />

        <PageConfirmation
            v-else-if="pageCourante === 'confirmation'"
            :client="clientConnecte"
            :panier="panierConfirme"
            :idCommande="derniereCommande"
            @naviguer="naviguer"
        />
    </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import PageAccueil from './components/PageAccueil.vue'
import PageBoutique from './components/PageBoutique.vue'
import PagePersonnalisation from './components/PagePersonnalisation.vue'
import PagePanier from './components/PagePanier.vue'
import PageAuth from './components/PageAuth.vue'
import PageCommandes from './components/PageCommandes.vue'
import PageConfirmation from './components/PageConfirmation.vue'

export default {
    name: 'App',
    components: {
        NavBar,
        PageAccueil,
        PageBoutique,
        PagePersonnalisation,
        PagePanier,
        PageAuth,
        PageCommandes,
        PageConfirmation
    },
    data() {
        return {
            pageCourante: 'accueil',   // page active
            jusSelectionne: null,       // jus cliqué dans la boutique
            panier: [],                 // articles dans le panier
            clientConnecte: null,       // client connecté
            derniereCommande: '',       // id de la dernière commande passée
            panierConfirme: []          // copie du panier pour la confirmation
        }
    },
    computed: {
        nbArticlesPanier() {
            return this.panier.reduce((s, a) => s + a.qte, 0)
        }
    },
    methods: {
        // ─── Navigation ──────────────────────────────────────────────────────
        naviguer(page) {
            // Protéger les pages privées
            if (page === 'mesCommandes' && !this.clientConnecte) {
                this.pageCourante = 'connexion'
                return
            }
            this.pageCourante = page
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },

        // ─── Boutique ─────────────────────────────────────────────────────────
        ouvrirPersonnalisation(jus) {
            this.jusSelectionne = jus
            this.pageCourante = 'personnalisation'
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },

        // ─── Panier ───────────────────────────────────────────────────────────
        ajouterAuPanier(article) {
            this.panier.push(article)
            this.pageCourante = 'panier'
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        supprimerArticle(index) {
            this.panier.splice(index, 1)
        },
        mettreAJourQte({ index, qte }) {
            this.panier[index].qte = qte
            // Recalculer le total
            const a = this.panier[index]
            a.total = ((parseFloat(a.jus.prixUnitaire) + parseFloat(a.emballage.prixEmb)) * qte).toFixed(2)
        },

        // ─── Commande ─────────────────────────────────────────────────────────
        passerCommande() {
            if (!this.clientConnecte) {
                this.pageCourante = 'connexion'
                return
            }

            const lignes = this.panier.map(a => ({
                idJus: a.jus.idJus,
                idEmb: a.emballage.idEmb,
                qte: String(a.qte)
            }))

            fetch('http://localhost:3000/commande', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idClient: this.clientConnecte.idClient, lignes })
            })
            .then(res => res.json())
            .then(data => {
                if (data[0] === true) {
                    this.derniereCommande = data[1]
                    this.panierConfirme = [...this.panier]
                    this.panier = []
                    this.pageCourante = 'confirmation'
                } else {
                    alert('Erreur lors de la commande. Veuillez réessayer.')
                }
            })
            .catch(() => {
                alert('Erreur de connexion au serveur.')
            })
        },

        // ─── Auth ─────────────────────────────────────────────────────────────
        connecterClient(client) {
            this.clientConnecte = client
            // Si le client venait du panier, on l'y renvoie
            this.pageCourante = this.panier.length > 0 ? 'panier' : 'accueil'
        },
        deconnecter() {
            this.clientConnecte = null
            this.pageCourante = 'accueil'
        }
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #0f0f1a;
}

#app {
    min-height: 100vh;
}

/* Badge panier flottant */
.badge-panier-flottant {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    padding: 0.8rem 1.4rem;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.5);
    z-index: 999;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.badge-panier-flottant:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.6);
}

.badge-panier-flottant span {
    background: #fff;
    color: #FF6B35;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 800;
}
</style>
