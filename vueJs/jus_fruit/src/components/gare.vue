<template>
    <div>
        <input id="recherche" placeholder="Gare à rechercher" v-model="villeRecherche">
        <button id="rechercher" type="submit" @click="rechercherGare()">Rechercher</button>

        <br><br>
        <center>
            <table border="1">
                <tr>
                    <th>CODE_UIC</th>
                    <th>LIBELLE</th>
                    <th>FRET</th>
                    <th>VOYAGEURS</th>
                    <th>COMMUNE</th>
                    <th>DEPARTEMENT</th>
                    <th>C_GEO</th>
                    <th>Action</th>
                </tr>
                <tr v-for="(uneGare,index) in listeGares" :key="index">
                    <td>{{ uneGare.CODE_UIC }}</td>
                    <td>{{ uneGare.LIBELLE }}</td>
                    <td>{{ uneGare.FRET }}</td>
                    <td>{{ uneGare.VOYAGEURS }}</td>
                    <td>{{ uneGare.COMMUNE }}</td>
                    <td>{{ uneGare.DEPARTEMEN }}</td>
                    <td>{{ uneGare.C_GEO }}</td>
                    <td>
                        <button @click="supprimerGare(uneGare.CODE_UIC)">Supprimer</button>
                        <button @click="$emit('evenement',uneGare)">Modifier</button>
                    </td>
                </tr>
            </table>
        </center>
    </div>

</template>

<script>
export default {
  name: 'gareComposent',
  data(){
    return {
        listeGares: ["moutarde","chocolat","frite"],
        villeRecherche :  "",
        villeSuppr : ""
    }
  },
  methods : {
    afficherGare(){
        fetch('http://localhost:3000/')
        .then(res => res.text())
        .then(jsonGares => {
            let gares=JSON.parse(jsonGares);
            console.log(gares)

            this.listeGares = gares[1];
        })
    },
    rechercherGare() {
        let url ="http://localhost:3000/rechercher/"
        if(this.villeRecherche == ""){
            url = "http://localhost:3000"
        }
        fetch(url+this.villeRecherche)
            .then(res => res.json())
            .then(jsonGares => {
                if(jsonGares[0] == true){
                    this.listeGares = jsonGares[1]
                }else {
                    alert("pas ok")
                }
            })
    },
    supprimerGare(code) {
        fetch('http://localhost:3000/deleteGare/'+code)
            .then(res => res.json())
            .then(jsonGares => {
                if(jsonGares[0] == true){
                    this.afficherGare()
                }else {
                    alert("pas ok")
                }
        })
    }
  },
  mounted(){ //onload
    this.afficherGare()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>