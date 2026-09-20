# ilémi.IA — site marketing

Site one-page Next.js (App Router) pour **ilémi.IA**, agence IA francophone.  
Slogan : *L'IA, enfin chez vous.*

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Polices Google : Montserrat (titres) + Karla (corps)
- Formulaire contact → Formspree (via variables d'environnement)
- Déploiement cible : **Vercel**

## Prérequis

- Node.js 20+
- npm

## Installation locale

```bash
cd ilemi-ia-site
cp .env.example .env.local
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `FORMSPREE_ID` | Non* | ID Formspree du formulaire (ex. `abcdefghi`). **Jamais un email.** |
| `NEXT_PUBLIC_FORMSPREE_ID` | Non* | Alternative publique au même ID. |
| `NEXT_PUBLIC_SITE_URL` | Non | URL canonique (OG / metadata), ex. `https://ilemi.ia` |

\* Si aucune des deux variables Formspree n'est définie, le formulaire affiche un message clair et propose Calendly / WhatsApp / mailto.

Créer un formulaire : [formspree.io](https://formspree.io) → copier l'ID (pas l'email).

## Scripts

```bash
npm run dev      # développement
npm run build    # build production
npm run start    # servir le build
npm run lint     # ESLint
```

## Contenu & sections

1. Hero  
2. Offres (onglets : La Maison / Entreprises / Agents IA)  
3. Pourquoi nous  
4. Comment ça marche  
5. Bandeau CTA  
6. À propos  
7. Contact  
8. Footer + pages `/mentions-legales` et `/confidentialite`

Liens branchés :

- Calendly : https://calendly.com/ilemi-ia27/on-discute  
- WhatsApp : https://wa.me/message/BVOJI7NRTXJAJ1  
- Email : ilemi.ia27@gmail.com  



## Auth & admin (v2)

Variables à définir en local (`.env.local`) et sur Vercel :

| Variable | Description |
|---|---|
| `ADMIN_EMAIL` | Email admin (ex. makboulathraoufou@gmail.com) |
| `ADMIN_PASSWORD` | Mot de passe admin — **uniquement en env, jamais dans git** |
| `AUTH_SECRET` | Secret JWT (chaîne aléatoire longue) |
| `DATABASE_URL` | SQLite local : `file:./prisma/dev.db` |

Sur Vercel, SQLite utilise `/tmp/ilemi.db` (éphémère par instance). Pour la production durable, migrer vers Postgres plus tard.

Routes : `/connexion`, `/inscription`, `/espace` (membre), `/admin` (ADMIN), `/apprendre`.

## Déploiement sur Vercel + domaine custom

1. Poussez le dépôt sur GitHub / GitLab / Bitbucket.  
2. Sur [vercel.com](https://vercel.com) → **Add New Project** → importez le repo.  
3. Root Directory : `ilemi-ia-site` (si monorepo) ou la racine de ce dossier.  
4. Framework preset : Next.js (détecté automatiquement).  
5. Ajoutez les variables d'env (`FORMSPREE_ID`, `NEXT_PUBLIC_SITE_URL`) dans **Settings → Environment Variables**.  
6. Deploy.

### Attacher un domaine custom

1. Vercel → projet → **Settings → Domains**.  
2. Ajoutez `ilemi.ia` (ou le domaine choisi) et `www` si besoin.  
3. Chez le registrar, pointez :
   - enregistrement **A** vers `76.76.21.21`, **ou**
   - enregistrement **CNAME** `www` → `cname.vercel-dns.com`  
   (suivez les instructions exactes affichées par Vercel).  
4. Attendez la validation SSL (Let's Encrypt, automatique).  
5. Mettez à jour `NEXT_PUBLIC_SITE_URL` avec l'URL finale et redéployez.

## Sécurité (v1)

- Aucune clé API dans le client.  
- Pas de chat Groq / Hugging Face en v1.  
- Ne committez jamais `.env.local`.

## Licence

Contenu et marque © Ilémi.IA. Code du site fourni pour usage du projet.
