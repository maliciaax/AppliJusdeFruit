<template>
  <div>
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
import gareComposent from './components/gare.vue'
import ajouterGare from './components/ajouter.vue'
import modifierGare from './components/modifier.vue'

export default {
  name: 'App',
  components: {
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
  margin-top: 60px;
}
</style>
