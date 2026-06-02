<template>
    <div class="accueil">
        <!-- Hero -->
        <section class="hero">
            <div class="hero-content">
                <h1>🍊 Des jus frais,<br><span class="accent">à votre image</span></h1>
                <p>Choisissez parmi nos recettes artisanales et personnalisez votre emballage : couleur, image, message… Un jus unique, rien que pour vous.</p>
                <button class="btn-primary" @click="$emit('naviguer', 'boutique')">Découvrir nos jus →</button>
            </div>
            <div class="hero-visual">
                <div class="fruit-circle">🍊</div>
                <div class="fruit-circle sm">🥭</div>
                <div class="fruit-circle sm2">🍓</div>
                <div class="fruit-circle sm3">🍍</div>
            </div>
        </section>

        <!-- Features -->
        <section class="features">
            <div class="feature-card">
                <span class="icon">🌿</span>
                <h3>100% Naturel</h3>
                <p>Fruits frais sélectionnés chaque matin, sans conservateurs ni arômes artificiels.</p>
            </div>
            <div class="feature-card">
                <span class="icon">🎨</span>
                <h3>Emballage Personnalisé</h3>
                <p>Choisissez la couleur, ajoutez une image et un texte pour un emballage unique.</p>
            </div>
            <div class="feature-card">
                <span class="icon">🚚</span>
                <h3>Livraison Rapide</h3>
                <p>Commandez aujourd'hui, recevez demain. Frais et savoureux, garantis.</p>
            </div>
        </section>

        <!-- CTA -->
        <section class="cta">
            <h2>Prêt à créer votre jus signature ?</h2>
            <button class="btn-primary" @click="$emit('naviguer', 'boutique')">Commander maintenant</button>
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
.accueil {
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    color: #f3f3f3;
}

/* HERO */
.hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5rem 4rem;
    min-height: 80vh;
    gap: 2rem;
}

.hero-content {
    max-width: 550px;
}

.hero-content h1 {
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
}

.accent {
    color: #FF6B35;
}

.hero-content p {
    font-size: 1.15rem;
    color: #ccc;
    margin-bottom: 2rem;
    line-height: 1.7;
}

.btn-primary {
    background: linear-gradient(135deg, #FF6B35, #f7931e);
    color: #fff;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.5);
}

/* VISUAL */
.hero-visual {
    position: relative;
    width: 380px;
    height: 380px;
    flex-shrink: 0;
}

.fruit-circle {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    animation: float 4s ease-in-out infinite;
}

.fruit-circle { font-size: 9rem; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.fruit-circle.sm  { font-size: 4rem; top: 5%;  left: 5%;  animation-delay: 0.5s; }
.fruit-circle.sm2 { font-size: 4rem; bottom: 5%; right: 5%; animation-delay: 1s; }
.fruit-circle.sm3 { font-size: 3.5rem; top: 5%; right: 10%; animation-delay: 1.5s; }

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-15px); }
}

.fruit-circle.sm,
.fruit-circle.sm2,
.fruit-circle.sm3 {
    transform: none;
}

/* FEATURES */
.features {
    display: flex;
    gap: 2rem;
    padding: 3rem 4rem;
    justify-content: center;
    flex-wrap: wrap;
}

.feature-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    max-width: 280px;
    transition: transform 0.2s, border-color 0.2s;
}

.feature-card:hover {
    transform: translateY(-4px);
    border-color: #FF6B35;
}

.feature-card .icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: #FF6B35;
    margin-bottom: 0.7rem;
}

.feature-card p {
    color: #aaa;
    font-size: 0.95rem;
    line-height: 1.6;
}

/* CTA */
.cta {
    text-align: center;
    padding: 4rem 2rem;
}

.cta h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
}
</style>
