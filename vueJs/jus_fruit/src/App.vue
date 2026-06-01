<template>
  <div>
    <menuPublic></menuPublic>
    <button @click="formulaire('ajouter')">
      <span>Ajouter Gare</span>
    </button>
    <button @click="formulaire('lister')">
      <span>Lister gare</span>
    </button>
    <ajouterGare v-if="afficherAjout" ></ajouterGare>
    <gareComposent v-else-if="afficherTableau" @evenement="modifier"></gareComposent>
    <modifierGare v-else-if="afficherModif" :gares="uneGare" @lister="formulaire('lister')"></modifierGare>    
  </div>
</template>

<script>
import menuPublic from './components/menu.vue'
import gareComposent from './components/gare.vue'
import ajouterGare from './components/ajouter.vue'
import modifierGare from './components/modifier.vue'

export default {
  name: 'App',
  components: {
    menuPublic,
    gareComposent,
    ajouterGare,
    modifierGare
  },
  data(){
    return {
      afficherTableau : true,
      afficherAjout : false,
      afficherModif : false,
      uneGare : {}
    }
  },
  methods : {
    formulaire(action){
      if (action == "lister"){
        this.afficherTableau = true
        this.afficherAjout = false
        this.afficherModif = false
      }
      if (action == "ajouter"){
        this.afficherTableau = false
        this.afficherAjout = true
        this.afficherModif = false
      }
      if (action == "modifier"){
        this.afficherTableau = false
        this.afficherAjout = false
        this.afficherModif = true
      }

    },
    modifier(gares){
      this.formulaire('modifier')
      this.uneGare = gares
    }
  }
}
</script>

<style>

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body{
      margin: 0;
  }

  nav {
      display: flex; align-items: center;
      position: sticky; top: 0; z-index: 100;
      justify-content: space-between;
      padding: 0.8rem 1.5rem;
      background-color: rgb(46, 46, 46);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .navlink {
      display: flex; gap: 1.5rem;
      list-style: none; margin: 0; padding: 0;
  }

  nav a { 
      text-decoration: none; 
      color: #f3f3f3; 
  }

  nav a:hover, nav a:focus { 
      color: #86b86a; 
      outline: none; 
  }

  nav a:focus-visible { 
      outline: 2px solid #86b86a; 
      border-radius: 3px; 
  }

  .imgLogo { 
      width: 13rem; 
  }

  .boutonLogin {
      background-color: #578040;
      padding: 0.45rem 1.1rem;
      border-radius: 0.5rem;
      color: #f3f3f3;
      border: none; cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.95rem; font-weight: 500;
      text-decoration: none;
      transition: background-color 0.2s;
  }

  .boutonLogin:hover { 
      background-color: rgb(70,106,50); 
      color: #f3f3f3!important;
  }

  .boutonLogin:focus-visible { 
      outline: 2px solid #f3f3f3; 
      outline-offset: 2px; 
  }

  #filtre .boutonLogin.actif {
      background-color: rgb(70,106,50);
      outline: 2px solid #f3f3f3;
  }
</style>
