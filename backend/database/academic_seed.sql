USE stoon_db;

INSERT INTO cities (id, nom, region) VALUES
(1, 'Casablanca', 'Casablanca-Settat'),
(2, 'Rabat', 'Rabat-Salé-Kénitra'),
(3, 'Marrakech', 'Marrakech-Safi'),
(4, 'Fès', 'Fès-Meknès'),
(5, 'Tanger', 'Tanger-Tétouan-Al Hoceïma')
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom),
  region = VALUES(region);

INSERT INTO schools (id, nom, type, ville_id, description, site_web) VALUES
(1, 'Université Hassan II de Casablanca', 'publique', 1, 'Université publique majeure de Casablanca avec plusieurs facultés et écoles.', 'https://www.univh2c.ma'),
(2, 'EMSI Casablanca', 'privée', 1, 'École marocaine des sciences de l’ingénieur orientée informatique et ingénierie.', 'https://www.emsi.ma'),
(3, 'Université Mohammed V de Rabat', 'publique', 2, 'Université publique historique couvrant sciences, droit, économie et lettres.', 'https://www.um5.ac.ma'),
(4, 'Université Internationale de Rabat', 'privée', 2, 'Université privée multidisciplinaire basée à Technopolis Rabat.', 'https://www.uir.ac.ma'),
(5, 'Université Cadi Ayyad', 'publique', 3, 'Université publique de référence à Marrakech et sa région.', 'https://www.uca.ma'),
(6, 'ENSA Marrakech', 'publique', 3, 'École nationale des sciences appliquées spécialisée en ingénierie.', 'https://www.ensa.ac.ma'),
(7, 'Université Sidi Mohamed Ben Abdellah', 'publique', 4, 'Université publique de Fès couvrant médecine, sciences, économie et lettres.', 'https://www.usmba.ac.ma'),
(8, 'Université Privée de Fès', 'privée', 4, 'Université privée proposant des formations professionnalisantes.', 'https://www.upf.ac.ma'),
(9, 'Université Abdelmalek Essaâdi', 'publique', 5, 'Université publique du nord du Maroc basée à Tanger-Tétouan.', 'https://www.uae.ac.ma'),
(10, 'HEM Tanger', 'privée', 5, 'École privée de management et commerce présente à Tanger.', 'https://hem.ac.ma')
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom),
  type = VALUES(type),
  ville_id = VALUES(ville_id),
  description = VALUES(description),
  site_web = VALUES(site_web);

INSERT INTO programs (id, nom, niveau, ecole_id) VALUES
(1, 'Génie informatique', 'Bac+5', 2),
(2, 'Réseaux et cybersécurité', 'Bac+5', 2),
(3, 'Sciences économiques et gestion', 'Bac+3', 1),
(4, 'Médecine générale', 'Bac+5', 7),
(5, 'Droit privé', 'Bac+3', 3),
(6, 'Finance et audit', 'Bac+5', 4),
(7, 'Marketing digital', 'Bac+5', 10),
(8, 'Génie industriel', 'Bac+5', 6),
(9, 'Mathématiques appliquées', 'Bac+3', 5),
(10, 'Développement web et mobile', 'Bac+2', 8),
(11, 'Intelligence artificielle', 'Bac+5', 6),
(12, 'Architecture logicielle', 'Bac+5', 4),
(13, 'Commerce international', 'Bac+3', 10),
(14, 'Biologie médicale', 'Bac+3', 7),
(15, 'Physique appliquée', 'Bac+3', 9)
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom),
  niveau = VALUES(niveau),
  ecole_id = VALUES(ecole_id);

