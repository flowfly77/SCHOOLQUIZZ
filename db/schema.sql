-- ===============================
-- Base Quiz — Schéma SQL
-- ===============================
-- Compatibilité SQLite / MySQL (types simples)
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,      -- '6e', '5e', '4e', '3e'
  label TEXT NOT NULL             -- '6ème', '5ème', etc.
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,             -- 'anglais', 'francais', ...
  label TEXT NOT NULL,
  UNIQUE(code)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_code TEXT NOT NULL,       -- référence vers classes.code
  subject_code TEXT NOT NULL,     -- référence vers subjects.code
  key TEXT NOT NULL,              -- identifiant du quiz (ex: 'anglais_verbes')
  title TEXT NOT NULL,
  UNIQUE(class_code, subject_code, key)
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_key TEXT NOT NULL,         -- référence vers quizzes.key
  question TEXT NOT NULL,
  option1 TEXT NOT NULL,
  option2 TEXT NOT NULL,
  option3 TEXT NOT NULL,
  option4 TEXT NOT NULL,
  correct_index INTEGER NOT NULL  -- 1..4
);
