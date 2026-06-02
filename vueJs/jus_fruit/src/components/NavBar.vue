<template>
    <nav>
        <div class="nav-logo" @click="$emit('naviguer', 'accueil')">
            🍊 <span class="logo-text">JusFruit</span>
        </div>
        <ul class="navlink">
            <li @click="$emit('naviguer', 'accueil')"><span>Accueil</span></li>
            <li @click="$emit('naviguer', 'boutique')"><span>Boutique</span></li>
            <li v-if="client" @click="$emit('naviguer', 'mesCommandes')"><span>Mes commandes</span></li>
            <li v-if="!client" @click="$emit('naviguer', 'connexion')" class="boutonLogin">Se connecter</li>
            <li v-if="!client" @click="$emit('naviguer', 'inscription')" class="boutonLogin">Créer un compte</li>
            <li v-if="client" class="boutonLogin bouton-compte" @click="$emit('deconnexion')">
                👤 {{ client.prenomClient }} — Déconnexion
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        client: {
            type: Object,
            default: null
        }
    },
    emits: ['naviguer', 'deconnexion']
}
</script>

<style scoped>
nav {
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
    justify-content: space-between;
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    box-shadow: 0 2px 20px rgba(255, 107, 53, 0.2);
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #FF6B35;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.logo-text {
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
}

.navlink {
    display: flex;
    gap: 1.2rem;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
}

.navlink li {
    color: #f3f3f3;
    cursor: pointer;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
    font-size: 0.95rem;
}

.navlink li:hover {
    color: #FF6B35;
}

.boutonLogin {
    background-color: #FF6B35 !important;
    padding: 0.45rem 1.1rem !important;
    border-radius: 20px !important;
    color: #fff !important;
    font-weight: 500;
    font-size: 0.9rem !important;
}

.boutonLogin:hover {
    background-color: #e55a24 !important;
    color: #fff !important;
}

.bouton-compte {
    background-color: #2e7d32 !important;
    font-size: 0.85rem !important;
}

.bouton-compte:hover {
    background-color: #1b5e20 !important;
}
</style>
