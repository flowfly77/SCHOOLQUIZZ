
# SCHOOL QUIZZ — By Flow'ZDev (V5)
- Topbar sticky (mobile OK), pas de doublons, e-mail masqué
- Profils: 4 cartes (clic carte = entrée), nom éditable (encadré), badges, sélecteur de classe, reset
- Enregistrement Firestore: compteurs, meilleur %, badges, journal (20 derniers)
- v3.html déjà patché (fonction `envoyerResultatQuiz`)
- DB exemple SQL dans /db

## Déploiement GitHub Pages
1) Uploade tous les fichiers à la racine du dépôt.
2) Dans `js/auth.js`, adapte `BASE_PATH` si le dossier du repo est différent de `/QUIZZ-6EME/`.
3) Firebase: Authentication (Email link), Domaines autorisés (ton GH Pages), Firestore règles (voir guide).

## Quota e-mail
`auth/quota-exceeded` = limite quotidienne d'envoi sur plan gratuit. Pour tester quand le quota est atteint:
- active temporairement "Mot de passe" dans Auth, ou crée un second projet, ou attends la réinitialisation.
