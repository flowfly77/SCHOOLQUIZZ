# SCHOOL QUIZZ — By Flow'ZDev (pro V4)
- Topbar sticky (mobile/tablette OK), aucun doublon de boutons, e-mail masqué.
- Profils : clic carte = entrée directe, nom éditable en encadré, badges visibles, sélecteur de classe, reset.
- V3 → Firestore : scores sauvegardés, badges, et **journal (20 derniers)**.

## Quota Firebase
Si tu vois `auth/quota-exceeded` en test, c'est la **limite quotidienne** d'envoi des liens e-mail (plan gratuit). Solutions de test :
- activer provisoirement "mot de passe" (Password) dans Authentication,
- ou créer un second projet Firebase, ou attendre le lendemain.

## Chemin de retour
Dans `js/auth.js`, adapte `BASE_PATH` au chemin exact GitHub Pages si tu changes de dépôt/dossier.
