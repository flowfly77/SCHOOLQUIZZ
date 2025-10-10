# Base SQL des questions

Deux fichiers :
- `schema.sql` : création des tables (classes, subjects, quizzes, questions)
- `seed_6e.sql` : exemples pour la 6e (Anglais/Verbes, Culture Pop).

## Idée d'usage côté front
Vous pouvez exporter/convertir ces données en JSON pour chargement statique, ou bien exposer une API qui renvoie les questions en fonction de `class_code`, `subject_code` et `quiz_key`.

## Extension pour 5e, 4e, 3e
Ajoutez de nouveaux quizzes :
```sql
INSERT OR IGNORE INTO quizzes (class_code, subject_code, key, title)
VALUES ('5e','anglais','anglais_vocab','Anglais — Vocabulaire (5e'));
```

Puis insérez vos questions :
```sql
INSERT INTO questions (quiz_key, question, option1, option2, option3, option4, correct_index) VALUES
('anglais_vocab', 'Traduire « maison »', 'house','home','mouse','horse', 1);
```
