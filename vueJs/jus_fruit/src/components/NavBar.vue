<template>
    <nav>
        <!-- Logo -->
        <div class="logo" @click="$emit('naviguer', 'accueil')">
            🍊 <span>JuicePackaging</span>
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

            <!-- Connecté : menu déroulant -->
            <div v-if="client" class="menu-compte" ref="menuRef">
                <button class="btn-compte" @click="menuOuvert = !menuOuvert">
                    👤 {{ client.prenomClient }} ▾
                </button>
                <div v-if="menuOuvert" class="dropdown">
                    <div class="dropdown-item" @click="naviguerEtFermer('mesCommandes')">
                        📦 Mes commandes
                    </div>
                    <div class="dropdown-separator"></div>
                    <div class="dropdown-item item-danger" @click="deconnexion">
                        🚪 Déconnexion
                    </div>
                </div>
            </div>

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
        client:   { type: Object, default: null },
        nbPanier: { type: Number, default: 0 }
    },
    emits: ['naviguer', 'deconnexion'],
    data() {
        return { menuOuvert: false }
    },
    mounted() {
        document.addEventListener('click', this.fermerMenuExterieur)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.fermerMenuExterieur)
    },
    methods: {
        naviguerEtFermer(page) {
            this.menuOuvert = false
            this.$emit('naviguer', page)
        },
        deconnexion() {
            this.menuOuvert = false
            this.$emit('deconnexion')
        },
        fermerMenuExterieur(e) {
            if (this.$refs.menuRef && !this.$refs.menuRef.contains(e.target)) {
                this.menuOuvert = false
            }
        }
    }
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

.actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    white-space: nowrap;
}

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

/* Menu déroulant compte */
.menu-compte { position: relative; }

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

.dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    background: #2a2a2a;
    border: 1px solid var(--bordure);
    border-radius: 10px;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    overflow: hidden;
    z-index: 200;
}
.dropdown-item {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
    color: var(--texte);
    cursor: pointer;
    transition: background 0.12s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.dropdown-item:hover { background: var(--bordure); }
.dropdown-separator {
    height: 1px;
    background: var(--bordure);
    margin: 0.2rem 0;
}
.item-danger { color: #f87171; }
.item-danger:hover { background: #3a1a1a; }

/* Boutons non connecté */
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
</style>
