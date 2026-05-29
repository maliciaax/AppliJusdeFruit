<template>
    <div>
        <form id="formMod" ref="formAjouter">
            <h1>Ajouter une gare</h1>

            <label for="CODE_UIC">CODE_UIC</label>
            <input id="CODE_UIC" name="CODE_UIC" value=""> <br><br>

            <label for="LIBELLE">LIBELLE</label>
            <input id="LIBELLE" name="LIBELLE" value=""> <br><br>

            <label for="FRET">FRET</label>
            <input id="FRET" name="FRET" value=""> <br><br>

            <label for="VOYAGEURS">VOYAGEURS</label>
            <input id="VOYAGEURS" name="VOYAGEURS" value=""> <br><br>

            <label for="COMMUNE">COMMUNE</label>
            <input id="COMMUNE" name="COMMUNE" value=""> <br><br>

            <label for="DEPARTEMEN">DEPARTEMEN</label>
            <input id="DEPARTEMEN" name="DEPARTEMEN" value=""> <br><br>

            <label for="C_GEO">C_GEO</label>
            <input id="C_GEO" name="C_GEO" value=""><br><br>

            <button type="button" id="ajouter" @click="ajouterGare()">Valider</button>
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
  name: 'ajouterGare',
  methods : {
    ajouterGare(){
        let monForm = this.$refs.formAjouter // sans get element by id pcq c pas bien
        let bodyFormData = new FormData(monForm)

        var object = {};
        bodyFormData.forEach(function(value, key){
          object[key] = value ;
        });
        var json = JSON.stringify(object);

        fetch('http://localhost:3000/ajouterGare', {method:"POST", headers: {
            "Content-Type": "application/json",
          }, body: json})
        .then(res => res.json())
        .then(jsonGares => {

            if(jsonGares[0] == true){
                alert("Gare ajouté")
            }else {
                alert("pas ok")
            }
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