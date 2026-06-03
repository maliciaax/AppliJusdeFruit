<template>
    <div class="accueil">

        <!-- Hero simple -->
        <section class="hero">
            <h1>Des jus frais,<br><span class="vert">à votre image</span></h1>
            <p>Choisissez parmi nos recettes artisanales et personnalisez votre brique : couleur, image, message.</p>
            <button class="btn-vert" @click="$emit('naviguer', 'boutique')">Voir nos jus →</button>
        </section>

        <!-- 3 arguments -->
        <section class="arguments">
            <div class="arg-card">
                <span class="icone">🌿</span>
                <h3>100% Naturel</h3>
                <p>Fruits frais sélectionnés chaque matin, sans conservateurs.</p>
            </div>
            <div class="arg-card">
                <span class="icone">🎨</span>
                <h3>Emballage personnalisé</h3>
                <p>Couleur, image et texte : une brique unique rien que pour vous.</p>
            </div>
            <div class="arg-card">
                <span class="icone">🚚</span>
                <h3>Livraison rapide</h3>
                <p>Commandez aujourd'hui, recevez demain. Frais garanti.</p>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    name: 'PageAccueil',
    emits: ['naviguer']
}
</script>

<style scoped>
.accueil { padding: 0 2rem 4rem; max-width: 900px; margin: 0 auto; }

/* Hero */
.hero {
    padding: 5rem 0 3rem;
    text-align: center;
}
.hero h1 {
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}
.vert { color: var(--vert); }
.hero p {
    color: var(--texte-doux);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
}
.btn-vert {
    background: var(--vert);
    border: none;
    color: #fff;
    padding: 0.75rem 2rem;
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s;
}
.btn-vert:hover { background: var(--vert-hover); }

/* Arguments */
.arguments {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
.arg-card {
    background: var(--carte);
    border: 1px solid var(--bordure);
    border-radius: var(--radius);
    padding: 1.5rem;
}
.icone { font-size: 1.8rem; display: block; margin-bottom: 0.8rem; }
.arg-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; }
.arg-card p { color: var(--texte-doux); font-size: 0.9rem; line-height: 1.5; }
</style>
