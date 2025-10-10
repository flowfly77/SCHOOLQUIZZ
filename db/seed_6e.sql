-- ===============================
-- Données initiales (6e)
-- ===============================
INSERT OR IGNORE INTO classes (code, label) VALUES
 ('6e','6ème'),('5e','5ème'),('4e','4ème'),('3e','3ème');

INSERT OR IGNORE INTO subjects (code, label) VALUES
 ('anglais','Anglais'),
 ('francais','Français'),
 ('maths','Mathématiques'),
 ('sciences','Sciences'),
 ('histoire','Histoire'),
 ('geographie','Géographie'),
 ('musique','Musique'),
 ('custom','Culture Pop');

INSERT OR IGNORE INTO quizzes (class_code, subject_code, key, title) VALUES
 ('6e','anglais','anglais_verbes','Anglais — Verbes (6e)'),
 ('6e','custom','culture_pop','Culture Pop (6e)');

-- Exemples de questions (6e, anglais_verbes)
INSERT INTO questions (quiz_key, question, option1, option2, option3, option4, correct_index) VALUES
 ('anglais_verbes', 'Comment dit-on « Je suis » en anglais ?', 'I am', 'I is', 'I are', 'I be', 1),
 ('anglais_verbes', 'Complète : « She ... happy »', 'am', 'is', 'are', 'be', 2),
 ('anglais_verbes', 'La forme interrogative de « You are » est ?', 'You are?', 'Are you?', 'Is you?', 'Do you are?', 2);

-- Exemples de questions (6e, culture_pop)
INSERT INTO questions (quiz_key, question, option1, option2, option3, option4, correct_index) VALUES
 ('culture_pop', 'Quel est le nom du cowboy dans Toy Story ?', 'Buzz', 'Rex', 'Woody', 'Andy', 3),
 ('culture_pop', 'Dans Fortnite, combien de joueurs en Battle Royale ?', '50', '75', '100', '150', 3),
 ('culture_pop', 'Qui habite dans un ananas sous la mer ?', 'Patrick', 'Carlo', 'Bob l\'éponge', 'Plankton', 3);
