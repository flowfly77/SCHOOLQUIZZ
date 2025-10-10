
-- db/questions_6e.sql
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  class_code TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id),
  prompt TEXT NOT NULL,
  choice_a TEXT NOT NULL,
  choice_b TEXT NOT NULL,
  choice_c TEXT NOT NULL,
  choice_d TEXT NOT NULL,
  correct TEXT NOT NULL CHECK (correct IN ('a','b','c','d'))
);
INSERT INTO quizzes (id,title,class_code) VALUES
('anglais_verbes','Anglais — Verbes (6e)','6e'),
('histoire_prehistoire','Histoire — Préhistoire (6e)','6e');
INSERT INTO questions (quiz_id,prompt,choice_a,choice_b,choice_c,choice_d,correct) VALUES
('anglais_verbes','Traduire: to be','être','avoir','faire','aller','a'),
('anglais_verbes','Traduire: to have','manger','faire','avoir','être','c'),
('histoire_prehistoire','Période avant l' || 'Antiquité ?','Moyen Âge','Temps modernes','Préhistoire','Renaissance','c');
