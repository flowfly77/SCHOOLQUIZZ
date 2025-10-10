# QUIZZ-6EME modulaire

- `index.html` : page principale (auth e‑mail, profils, intégration V3)
- `v3.html` : ton menu V3
- `css/` : styles
- `js/` : logique (auth.js, profiles.js, etc.)
- `db/` : base SQL (schéma + seed pour 6e)

## Firebase
- Authentication → Email/Mot de passe → **Lien envoyé par e‑mail** activé
- Domaines autorisés : `ton-user.github.io`
- Firestore règles :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/data/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## GitHub Pages
Déploie ce dossier à la racine du repo. Accès : `https://<user>.github.io/QUIZZ-6EME/`
