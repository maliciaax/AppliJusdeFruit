<template>
    <nav>
        <!-- Logo -->
        <div class="logo" @click="$emit('naviguer', 'accueil')">
            🍊 <span>JusFruit</span>
        </div>

        <!-- Liens -->
        <ul class="liens">
            <li @click="$emit('naviguer', 'accueil')">Accueil</li>
            <li @click="$emit('naviguer', 'boutique')">Boutique</li>
            <li v-if="client" @click="$emit('naviguer', 'mesCommandes')">Mes commandes</li>
        </ul>

        <!-- Droite : panier + compte -->
        <div class="actions">
            <!-- Panier -->
            <button class="btn-panier" @click="$emit('naviguer', 'panier')">
                🛒 Panier
                <span v-if="nbPanier > 0" class="badge">{{ nbPanier }}</span>
            </button>

            <!-- Connecté -->
            <button v-if="client" class="btn-compte" @click="$emit('deconnexion')">
                👤 {{ client.prenomClient }} — Déconnexion
            </button>

            <!-- Pas connecté -->
            <template v-else>
                <button class="btn-outline" @click="$emit('naviguer', 'connexion')">Se connecter</button>
                <button class="btn-vert"    @click="$emit('naviguer', 'inscription')">Créer un compte</button>
            </template>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        client:    { type: Object,  default: null },
        nbPanier:  { type: Number,  default: 0 }
    },
    emits: ['naviguer', 'deconnexion']
}
</script>

<style scoped>
nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 64px;
    background: #242424;
    border-bottom: 1px solid var(--bordure);
    position: sticky;
    top: 0;
    z-index: 100;
    gap: 1.5rem;
}

/* Logo */
.logo {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--vert);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
}
.logo span { color: var(--texte); }

/* Liens du milieu */
.liens {
    display: flex;
    list-style: none;
    gap: 0.3rem;
    flex: 1;
    justify-content: center;
}
.liens li {
    padding: 0.4rem 0.9rem;
    border-radius: 8px;
    cursor: pointer;
    color: var(--texte-doux);
    font-size: 0.95rem;
    transition: background 0.15s, color 0.15s;
}
.liens li:hover { background: var(--bordure); color: var(--texte); }

/* Boutons à droite */
.actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    white-space: nowrap;
}

/* Bouton panier */
.btn-panier {
    background: var(--carte);
    border: 1px solid var(--bordure);
    color: var(--texte);
    padding: 0.45rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.15s;
}
.btn-panier:hover { background: var(--bordure); }

.badge {
    background: var(--vert);
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Bouton outline */
.btn-outline {
    background: transparent;
    border: 1px solid var(--bordure);
    color: var(--texte);
    padding: 0.45rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    transition: border-color 0.15s;
}
.btn-outline:hover { border-color: #666; }

/* Bouton vert */
.btn-vert {
    background: var(--vert);
    border: none;
    color: #fff;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: inherit;
    transition: background 0.15s;
}
.btn-vert:hover { background: var(--vert-hover); }

/* Bouton compte */
.btn-compte {
    background: #2e4d2e;
    border: 1px solid var(--vert);
    color: var(--vert);
    padding: 0.45rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: inherit;
    transition: background 0.15s;
}
.btn-compte:hover { background: #3a5e3a; }
</style>
