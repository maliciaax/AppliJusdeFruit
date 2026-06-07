<template>
    <div id="app">
        <NavBar
            v-if="pageCourante !== 'connexion' && pageCourante !== 'inscription'"
            :client="clientConnecte"
            :nbPanier="nbArticlesPanier"
            @naviguer="naviguer"
            @deconnexion="deconnecter"
        />

        <PageAccueil         v-if="pageCourante === 'accueil'"          @naviguer="naviguer" />
        <PageBoutique        v-else-if="pageCourante === 'boutique'"    @selectionnerJus="ouvrirPersonnalisation" />
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
import NavBar               from './components/NavBar.vue'
import PageAccueil          from './components/PageAccueil.vue'
import PageBoutique         from './components/PageBoutique.vue'
import PagePersonnalisation from './components/PagePersonnalisation.vue'
import PagePanier           from './components/PagePanier.vue'
import PageAuth             from './components/PageAuth.vue'
import PageCommandes        from './components/PageCommandes.vue'
import PageConfirmation     from './components/PageConfirmation.vue'

export default {
    name: 'App',
    components: { NavBar, PageAccueil, PageBoutique, PagePersonnalisation, PagePanier, PageAuth, PageCommandes, PageConfirmation },
    data() {
        return {
            pageCourante: 'accueil',
            jusSelectionne: null,
            panier: [],
            clientConnecte: null,
            derniereCommande: '',
            panierConfirme: []
        }
    },
    computed: {
        nbArticlesPanier() {
            return this.panier.reduce((s, a) => s + a.qte, 0)
        }
    },
    methods: {
        naviguer(page) {
            if ((page === 'mesCommandes' || page === 'profil') && !this.clientConnecte) {
                this.pageCourante = 'connexion'; return
            }
            this.pageCourante = page
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        ouvrirPersonnalisation(jus) {
            this.jusSelectionne = jus
            this.pageCourante = 'personnalisation'
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
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
            const a = this.panier[index]
            a.total = ((parseFloat(a.jus.prixUnitaire) + parseFloat(a.emballage.prixEmb)) * qte).toFixed(2)
        },
        passerCommande() {
            if (!this.clientConnecte) { this.pageCourante = 'connexion'; return }
            const lignes = this.panier.map(a => ({ idJus: a.jus.idJus, idEmb: a.emballage.idEmb, qte: String(a.qte) }))
            fetch('/commande', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idClient: this.clientConnecte.idClient, lignes })
            })
            .then(res => res.json())
            .then(data => {
                if (data[0] === true) {
                    this.derniereCommande = data[1]
                    this.panierConfirme = [...this.panier] //...créer une copie du panier
                    this.panier = []
                    this.pageCourante = 'confirmation'
                } else {
                    alert('Erreur lors de la commande.')
                }
            })
            .catch(() => alert('Erreur de connexion au serveur.'))
        },
        connecterClient(client) {
            this.clientConnecte = client
            this.pageCourante = this.panier.length > 0 ? 'panier' : 'accueil'
        },
        deconnecter() {
            this.clientConnecte = null;
            this.pageCourante = 'accueil'
        },
        onCompteSuprime() {
            this.clientConnecte = null
            this.panier = []
            this.pageCourante = 'accueil'
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'DM Sans', sans-serif;
    background: #1e1e1e;
    color: #f0f0f0;
    -webkit-font-smoothing: antialiased;
}

/* Variables globales */
:root {
    --vert:        #578040;
    --vert-hover:  rgb(70, 106, 50);
    --fond:        #1e1e1e;
    --carte:       #2a2a2a;
    --bordure:     #3a3a3a;
    --texte:       #f0f0f0;
    --texte-doux:  #aaaaaa;
    --radius:      12px;
}
</style>
