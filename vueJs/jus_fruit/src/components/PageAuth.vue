<template>
    <div class="auth-page">
        <div class="auth-card">
            <!-- Onglets -->
            <div class="onglets">
                <button :class="{ actif: mode === 'connexion' }" @click="mode = 'connexion'">Se connecter</button>
                <button :class="{ actif: mode === 'inscription' }" @click="mode = 'inscription'">Créer un compte</button>
            </div>

            <!-- CONNEXION -->
            <div v-if="mode === 'connexion'" class="formulaire">
                <h2>👋 Bon retour !</h2>

                <div class="groupe">
                    <label>Email</label>
                    <input type="email" v-model="connexion.mail" placeholder="votre@email.com" />
                </div>
                <div class="groupe">
                    <label>Mot de passe</label>
                    <input type="password" v-model="connexion.mdp" placeholder="••••••••" @keyup.enter="seConnecter" />
                </div>

                <p v-if="erreurConnexion" class="msg-erreur">❌ {{ erreurConnexion }}</p>

                <button class="btn-submit" :disabled="chargement" @click="seConnecter">
                    {{ chargement ? 'Connexion…' : 'Se connecter' }}
                </button>
            </div>

            <!-- INSCRIPTION -->
            <div v-if="mode === 'inscription'" class="formulaire">
                <h2>🎉 Créer un compte</h2>

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

                <p v-if="erreurInscription" class="msg-erreur">❌ {{ erreurInscription }}</p>
                <p v-if="successInscription" class="msg-succes">✅ {{ successInscription }}</p>

                <button class="btn-submit" :disabled="chargement" @click="sInscrire">
                    {{ chargement ? 'Création…' : 'Créer mon compte' }}
                </button>
            </div>

            <p class="lien-retour" @click="$emit('naviguer', 'accueil')">← Retour à l'accueil</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageAuth',
    props: {
        modeInitial: {
            type: String,
            default: 'connexion'
        }
    },
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
            if (!this.connexion.mail || !this.connexion.mdp) {
                this.erreurConnexion = 'Veuillez remplir tous les champs.'
                return
            }
            this.chargement = true
            fetch('http://localhost:3000/client/connexion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mailClient: this.connexion.mail, mdp: this.connexion.mdp })
            })
            .then(res => res.json())
            .then(data => {
                this.chargement = false
                if (data[0] === true) {
                    this.$emit('connexionReussie', data[1])
                } else {
                    this.erreurConnexion = 'Email ou mot de passe incorrect.'
                }
            })
            .catch(() => {
                this.chargement = false
                this.erreurConnexion = 'Erreur de connexion au serveur.'
            })
        },
        sInscrire() {
            this.erreurInscription = null
            this.successInscription = null
            const { nom, prenom, mail, tel, adresse, cp, mdp } = this.inscription
            if (!nom || !prenom || !mail || !tel || !adresse || !cp || !mdp) {
                this.erreurInscription = 'Veuillez remplir tous les champs.'
                return
            }
            this.chargement = true
            fetch('http://localhost:3000/client/inscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nomClient: nom, prenomClient: prenom, mailClient: mail,
                    numClient: parseInt(tel), adresseClient: adresse,
                    cdpClient: parseInt(cp), mdp
                })
            })
            .then(res => res.json())
            .then(data => {
                this.chargement = false
                if (data[0] === true) {
                    this.successInscription = 'Compte créé ! Vous pouvez vous connecter.'
                    this.mode = 'connexion'
                    this.connexion.mail = this.inscription.mail
                } else {
                    this.erreurInscription = 'Erreur lors de la création du compte.'
                }
            })
            .catch(() => {
                this.chargement = false
                this.erreurInscription = 'Erreur de connexion au serveur.'
            })
        }
    }
}
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.auth-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

/* Onglets */
.onglets {
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 4px;
}
.onglets button {
    flex: 1;
    padding: 0.6rem;
    border: none;
    background: none;
    color: #aaa;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
}
.onglets button.actif {
    background: #FF6B35;
    color: #fff;
    font-weight: 700;
}

/* Formulaire */
.formulaire h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #fff;
}

.groupe {
    margin-bottom: 1.2rem;
}
.groupe label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #ccc;
    margin-bottom: 0.4rem;
}
.groupe input {
    width: 100%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 0.7rem 1rem;
    color: #fff;
    font-size: 0.95rem;
    box-sizing: border-box;
    transition: border-color 0.2s;
}
.groupe input:focus {
    outline: none;
    border-color: #FF6B35;
    background: rgba(255,107,53,0.08);
}
.groupe input::placeholder { color: #666; }

.grille-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.msg-erreur { color: #ff6b6b; font-size: 0.85rem; margin-bottom: 0.8rem; }
.msg-succes { color: #4CAF50; font-size: 0.85rem; margin-bottom: 0.8rem; }

.btn-submit {
    width: 100%;
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 0.9rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 20px rgba(255,107,53,0.4);
}
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.lien-retour {
    text-align: center;
    color: #666;
    font-size: 0.85rem;
    margin-top: 1.5rem;
    cursor: pointer;
    transition: color 0.2s;
}
.lien-retour:hover { color: #FF6B35; }
</style>
