# 🚀 Portail QR Code — Portfolio de Ryad Khensous

Un site web moderne, immersif et responsive en **HTML5, CSS3 pur et JavaScript**, générant un QR Code stylisé qui redirige automatiquement vers votre portfolio :
👉 **[https://ryadkhensous.vercel.app/](https://ryadkhensous.vercel.app/)**

---

## ✨ Fonctionnalités incluses

1. **Génération Dynamique du QR Code** :
   - Génération en temps réel avec coins arrondis, dégradé moderne et haute précision de scan.
   - Système de repli automatique (fallback) pour garantir que le QR Code s'affiche dans toutes les conditions.
2. **Animation Laser Scanner** :
   - Faisceau laser dynamique simulant un scan futuriste avec bouton interactif pour l'activer ou le mettre en pause.
3. **Personnalisation des Thèmes en 1 Clic** :
   - ⚡ **Cyber Cyan** (Cyan électrique et bleu nuit)
   - 🔮 **Néon Violet** (Violet futuriste & pourpre)
   - 💎 **Émeraude Tech** (Vert émeraude & cyan)
   - 🖤 **Minimal Blanc** (Style contrasté noir & blanc classique)
4. **Export Haute Résolution (Print Ready)** :
   - Boutons de téléchargement instantané au format **PNG** (haute définition 1000x1000px) et **SVG** (vectoriel infini sans perte de qualité) — idéal pour votre CV papier, badges d'événements, présentations ou cartes de visite.
5. **Actions Rapides** :
   - **Visiter le Portfolio** : lien direct vers votre portfolio en ligne.
   - **Copier le lien** : copie instantanée dans le presse-papier avec notification toast.
   - **Partager** : partage natif mobile (Web Share API).
6. **Aperçu Carte de Visite Digitale** :
   - Simulation en direct d'une carte de visite avec mini QR Code intégré.
7. **Guide de scan en 3 étapes** pour guider tout recruteur ou client.

---

## 💻 Comment l'utiliser

### Option 1 : Ouverture directe (sans serveur)
Double-cliquez simplement sur le fichier [`index.html`](file:///d:/projets/site_portf_QR/index.html) pour l'ouvrir dans votre navigateur préféré (Google Chrome, Edge, Brave, Safari, Firefox).

### Option 2 : Lancer avec le serveur local Node.js
Ouvrez un terminal dans le dossier et lancez :
```bash
node local-server.js
```
ou
```bash
npm start
```
Vous obtiendrez :
- **Adresse locale** : `http://localhost:3000`
- **Adresse réseau** : `http://192.168.1.64:3000` *(accessible depuis votre smartphone connecté au même Wi-Fi)*

---

## 📁 Architecture des fichiers

- [`index.html`](file:///d:/projets/site_portf_QR/index.html) : Structure sémantique HTML5 & SEO.
- [`style.css`](file:///d:/projets/site_portf_QR/style.css) : Système de design moderne, glassmorphism, animations et thèmes CSS.
- [`script.js`](file:///d:/projets/site_portf_QR/script.js) : Moteur de génération du QR Code, presets de couleurs, exports PNG/SVG et interactions.
- [`server.js`](file:///d:/projets/site_portf_QR/server.js) : Serveur HTTP local ultra-léger sans dépendances externes.
- [`package.json`](file:///d:/projets/site_portf_QR/package.json) : Configuration du projet.
