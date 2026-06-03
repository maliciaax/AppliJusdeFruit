<template>
    <div class="auth-page">
        <div class="auth-card">
            <!-- Logo -->
            <div class="logo" @click="$emit('naviguer', 'accueil')">🍊 JusFruit</div>

            <!-- Onglets -->
            <div class="onglets">
                <button :class="{ actif: mode === 'connexion' }"   @click="mode = 'connexion'">Se connecter</button>
                <button :class="{ actif: mode === 'inscription' }" @click="mode = 'inscription'">Créer un compte</button>
            </div>

            <!-- CONNEXION -->
            <div v-if="mode === 'connexion'">
                <div class="groupe">
                    <label>Email</label>
                    <input type="email" v-model="connexion.mail" placeholder="votre@email.com" />
                </div>
                <div class="groupe">
                    <label>Mot de passe</label>
                    <input type="password" v-model="connexion.mdp" placeholder="••••••••" @keyup.enter="seConnecter" />
                </div>
                <p v-if="erreurConnexion" class="msg-erreur">{{ erreurConnexion }}</p>
                <button class="btn-submit" :disabled="chargement" @click="seConnecter">
                    {{ chargement ? 'Connexion…' : 'Se connecter' }}
                </button>
            </div>

            <!-- INSCRIPTION -->
            <div v-if="mode === 'inscription'">
                <div class="grille-2">
                    <div class="groupe">
                        <label>Nom</label>
                        <input type="text" v-model="inscription.nom" placeholder="Dupont" />
                    </div>
                    <div class="groupe">
                        <label>Prénom</label>
                        <input type="text" v-model="inscription.prenom" placeholder="Marie" />
                    </div>
                </div>
                <div class="groupe">
                    <label>Email</label>
                    <input type="email" v-model="inscription.mail" placeholder="votre@email.com" />
                </div>
                <div class="groupe">
                    <label>Téléphone</label>
                    <input type="tel" v-model="inscription.tel" placeholder="0612345678" />
                </div>
                <div class="groupe">
                    <label>Adresse</label>
                    <input type="text" v-model="inscription.adresse" placeholder="3 rue des Orangers" />
                </div>
                <div class="groupe">
                    <label>Code postal</label>
                    <input type="number" v-model="inscription.cp" placeholder="75001" />
                </div>
                <div class="groupe">
                    <label>Mot de passe</label>
                    <input type="password" v-model="inscription.mdp" placeholder="••••••••" />
                </div>
                <p v-if="erreurInscription" class="msg-erreur">{{ erreurInscription }}</p>
                <p v-if="successInscription" class="msg-succes">{{ successInscription }}</p>
                <button class="btn-submit" :disabled="chargement" @click="sInscrire">
                    {{ chargement ? 'Création…' : 'Créer mon compte' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageAuth',
    props: { modeInitial: { type: String, default: 'connexion' } },
    emits: ['naviguer', 'connexionReussie'],
    data() {
        return {
            mode: this.modeInitial,
            chargement: false,
            connexion: { mail: '', mdp: '' },
            inscription: { nom: '', prenom: '', mail: '', tel: '', adresse: '', cp: '', mdp: '' },
            erreurConnexion: null,
            erreurInscription: null,
            successInscription: null
        }
    },
    methods: {
        seConnecter() {
            this.erreurConnexion = null
            if (!this.connexion.mail || !this.connexion.mdp) { this.erreurConnexion = 'Veuillez remplir tous les champs.'; return }
            this.chargement = true
            fetch('http://localhost:3000/client/connexion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mailClient: this.connexion.mail, mdp: this.connexion.mdp })
            })
            .then(res => res.json())
            .then(data => {
                this.chargement = false
                if (data[0] === true) { this.$emit('connexionReussie', data[1]) }
                else { this.erreurConnexion = 'Email ou mot de passe incorrect.' }
            })
            .catch(() => { this.chargement = false; this.erreurConnexion = 'Erreur de connexion au serveur.' })
        },
        sInscrire() {
            this.erreurInscription = null
            this.successInscription = null
            const { nom, prenom, mail, tel, adresse, cp, mdp } = this.inscription
            if (!nom || !prenom || !mail || !tel || !adresse || !cp || !mdp) { this.erreurInscription = 'Veuillez remplir tous les champs.'; return }
            this.chargement = true
            fetch('http://localhost:3000/client/inscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nomClient: nom, prenomClient: prenom, mailClient: mail, numClient: parseInt(tel), adresseClient: adresse, cdpClient: parseInt(cp), mdp })
            })
            .then(res => res.json())
            .then(data => {
                this.chargement = false
                if (data[0] === true) {
                    this.successInscription = '✅ Compte créé ! Vous pouvez vous connecter.'
                    this.mode = 'connexion'
                    this.connexion.mail = this.inscription.mail
                } else { this.erreurInscription = 'Erreur lors de la création du compte.' }
            })
            .catch(() => { this.chargement = false; this.erreurInscription = 'Erreur de connexion au serveur.' })
        }
    }
}
</script>

<style scoped>
.auth-page {
    min-height: 100vh; background: var(--fond);
    display: flex; align-items: center; justify-content: center; padding: 2rem;
}

.auth-card {
    background: var(--carte); border: 1px solid var(--bordure);
    border-radius: 16px; padding: 2rem; width: 100%; max-width: 420px;
}

.logo {
    font-size: 1.2rem; font-weight: 700; color: var(--vert);
    margin-bottom: 1.5rem; cursor: pointer; text-align: center;
}

/* Onglets */
.onglets {
    display: flex; background: var(--fond); border-radius: 10px;
    padding: 3px; margin-bottom: 1.5rem; gap: 3px;
}
.onglets button {
    flex: 1; padding: 0.55rem; border: none; background: none;
    color: var(--texte-doux); border-radius: 8px; cursor: pointer;
    font-size: 0.9rem; font-weight: 500; font-family: inherit;
    transition: background 0.15s, color 0.15s;
}
.onglets button.actif { background: var(--vert); color: #fff; font-weight: 600; }

/* Champs */
.groupe { margin-bottom: 1rem; }
.groupe label { display: block; font-size: 0.85rem; font-weight: 600; color: #ccc; margin-bottom: 0.4rem; }
.groupe input {
    width: 100%; background: var(--fond); border: 1px solid var(--bordure);
    border-radius: 8px; padding: 0.6rem 0.9rem; color: var(--texte);
    font-size: 0.95rem; font-family: inherit; box-sizing: border-box;
    transition: border-color 0.15s;
}
.groupe input:focus { outline: none; border-color: var(--vert); }
.groupe input::placeholder { color: #555; }

.grille-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }

.msg-erreur { color: #e74c3c; font-size: 0.85rem; margin-bottom: 0.8rem; }
.msg-succes { color: var(--vert); font-size: 0.85rem; margin-bottom: 0.8rem; }

.btn-submit {
    width: 100%; background: var(--vert); border: none; color: #fff;
    padding: 0.75rem; border-radius: var(--radius); font-size: 0.95rem;
    font-weight: 600; font-family: inherit; cursor: pointer; transition: background 0.15s;
}
.btn-submit:hover:not(:disabled) { background: var(--vert-hover); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
