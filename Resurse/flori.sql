DROP TYPE IF EXISTS categ_evenimente CASCADE;
DROP TYPE IF EXISTS tipuri_produse CASCADE;
DROP TYPE IF EXISTS culoare_floare CASCADE;
DROP TABLE IF EXISTS flori CASCADE;

CREATE TYPE categ_evenimente AS ENUM('comanda speciala', 'aniversara', 'editie limitata', 'nunta', 'botez');
CREATE TYPE tipuri_produse AS ENUM('buchet', 'aranjament', 'cutie','cos','vas');
CREATE TYPE culoare_floare AS ENUM('rosu', 'galben', 'roz', 'lila','albastru', 'portocaliu','alb', 'mov');

CREATE TABLE IF NOT EXISTS flori (
   id serial PRIMARY KEY, --a
   nume VARCHAR(50) UNIQUE NOT NULL, --b
   descriere TEXT, --c
   imagine VARCHAR(300), --d
   tip_produs tipuri_produse DEFAULT 'buchet', --e
   categorie categ_evenimente DEFAULT 'comanda speciala', --f
   pret NUMERIC(8,2) NOT NULL, --g 
   nr_fire NUMERIC(4) NOT NULL, --h
   data_adaugare TIMESTAMP DEFAULT current_timestamp, --i
   culoare culoare_floare NOT NULL, --j
   flori_componente VARCHAR [], --k
   pt_alergici BOOLEAN NOT NULL DEFAULT FALSE --l
);

INSERT into flori (nume, descriere, imagine, tip_produs, categorie, pret, nr_fire, data_adaugare, culoare, flori_componente, pt_alergici) VALUES 
('Buchet de trandafiri', 'Trandafirii sunt emblema iubirii și eleganței !', 'trandafir.png', DEFAULT, DEFAULT, 99, 11, DEFAULT, 'rosu', '{"trandafiri"}', False),

('Buchet de lalele', 'Lalelele au culori vibrante si foarte variate !', 'lalea.png', DEFAULT,'editie limitata', 49, 15, DEFAULT, 'portocaliu', '{"lalele"}', True),

('Buchet de floarea soarelui', 'Floarea soarelui are petalele luminoase și tulpina înaltă !', 'floarea-soarelui.png', 'aranjament', 'aniversara', 90, 5, DEFAULT, 'galben', '{"floarea-soarelui"}', True),

('Buchet de hortensii', 'Hortensiile sunt o minunată expresie a gratiei naturii', 'hortensie.png','aranjament','botez', 450 , 9, DEFAULT, 'lila', '{"hortensie"}', False),

('Buchet de narcise', 'Narcisele sunt simbol al optimismului si bucuriei !', 'narcisa.png','cos', DEFAULT , 56 , 25, DEFAULT,'galben' , '{"narcisa"}', True),

('Buchet de frezii', 'Buchet 51 frezii albe', 'frezie.png', DEFAULT, 'nunta', 469, 51, DEFAULT, 'alb', '{"frezii"}',DEFAULT),

('Buchet mixt de toamna', 'Aranjament adiere de toamna', 'flori-mixte.png','aranjament','editie limitata', 249, 15, DEFAULT, 'roz', '{"trandafiri"}', False),

('Buchet mixt', 'Cosulet cu zambile si lalele roz', 'flori-mixte.png', 'cos', 'editie limitata', 120, 11, DEFAULT, 'roz', '{"lalele","zambile"}', DEFAULT),

('Vas de zambile', 'Aranjament cu 19 de zambile roz in vas de sticla', 'zambila.png', 'vas', DEFAULT, 200, 19, DEFAULT, 'rosu', '{"zambile"}',True),

('Buchet de ghiocei', 'Vestitorii primaverii!', 'ghiocel.png', 'cos', 'editie limitata', 20, 49, DEFAULT, 'alb', '{"ghiocei"}', True),

('Pastel de primavara', ' Primavra in 3 culori', 'flori-mixte.png', 'aranjament', DEFAULT, 99, 11, DEFAULT,'roz', '{"lalele","narcisa","zambile"}', False),

('Aranjament de vara', 'Amintiri de vara', 'lalea.png', 'aranjament', 'nunta', 121, 37, DEFAULT, 'albastru', '{"hortensie"}', False),

('Cutie de primule', ' Cutie cu 7 primule !', 'primula.png', 'cutie','editie limitata', 66.5, 13, DEFAULT, 'mov', '{"primule"}', True),

('Cutie cu trandafiri', 'Cutie cu 101 trandafiri!', 'trandafir.png', 'cutie', 'comanda speciala', 99, 101, DEFAULT, 'rosu', '{"trandafiri"}', True),

('Aranjament de bujori', 'Bujori de primavara!', 'bujori.png', 'aranjament', DEFAULT, 50, 9, DEFAULT, 'roz', '{"bujori"}', DEFAULT),

('Vas de crini', ' 13 crini superbi !', 'crin.png', 'vas', DEFAULT, 77, 7, DEFAULT, 'alb', '{"crini"}', False)





