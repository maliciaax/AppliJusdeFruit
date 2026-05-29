<template>
    <div>
        <form id="formMod" ref="formModifier">
            <h1>Modifer une gare</h1>
            <label for="CODE_UIC">CODE_UIC</label>
            <input id="CODE_UIC" name="CODE_UIC" v-model="code"> <br><br>

            <label for="LIBELLE">LIBELLE</label>
            <input id="LIBELLE" name="LIBELLE" v-model="libelle"> <br><br>

            <label for="FRET">FRET</label>
            <input id="FRET" name="FRET" v-model="fret"> <br><br>

            <label for="VOYAGEURS">VOYAGEURS</label>
            <input id="VOYAGEURS" name="VOYAGEURS" v-model="voyageur"> <br><br>

            <label for="COMMUNE">COMMUNE</label>
            <input id="COMMUNE" name="COMMUNE" v-model="commune"> <br><br>

            <label for="DEPARTEMEN">DEPARTEMEN</label>
            <input id="DEPARTEMEN" name="DEPARTEMEN" v-model="departement"> <br><br>

            <label for="C_GEO">C_GEO</label>
            <input id="C_GEO" name="C_GEO" v-model="cgeo"><br><br>

            <button type="button" id="modifier" @click="modifierGare()">Valider</button>
        </form>
        <br>
        <br>
        <br>
        <br>
        <br>

    </div>

</template>

<script>
export default {
  name: 'modifierGare',
  props: {
    gares : Object
  },
  data(){
    return {
        code : this.gares.CODE_UIC,
        libelle : this.gares.LIBELLE,
        fret : this.gares.FRET,
        voyageur : this.gares.VOYAGEURS,
        commune : this.gares.COMMUNE,
        departement : this.gares.DEPARTEMEN,
        cgeo : this.gares.C_GEO
    }
  },
  methods : {
    modifierGare (){
        //let euuuuh= document.getElementById("formMod");
        let euuuuh= this.$refs.formModifier
        let formMod = new FormData(euuuuh);

        var object = {};
        formMod.forEach(function(value, key){
          object[key] = value ;
        });
        var json = JSON.stringify(object);


        fetch('http://localhost:3000/modifierGare/'+this.code,{method:"POST", headers: {
            "Content-Type": "application/json",
          }, body: json})
            .then(res => res.json())
            .then(() => {
              this.$emit('lister')
            })
    }
  },
  mounted(){ //onload
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>