USE stoon_db;

INSERT INTO users (first_name, last_name, email, password_hash, role, city, school, field_of_study, bio, reputation, email_verified, preferences)
VALUES
('Yassine','El Amrani','yassine@stoon.ma','$2a$12$7L8BvI69tWwH8oQHjqY.8ewhzHh9Q5HKEuS37NbwGs2j4P0mAv6Oe','admin','Casablanca','EMSI Casablanca','Informatique','Admin ST00N et développeur full-stack.',4.9,TRUE,JSON_OBJECT()),
('Salma','Bennani','salma.bennani@example.com','$2a$12$7L8BvI69tWwH8oQHjqY.8ewhzHh9Q5HKEuS37NbwGs2j4P0mAv6Oe','user','Rabat','UIR','Commerce','Étudiante en marketing digital.',4.7,TRUE,JSON_OBJECT()),
('Omar','Ait Lahcen','omar.ait@example.com','$2a$12$7L8BvI69tWwH8oQHjqY.8ewhzHh9Q5HKEuS37NbwGs2j4P0mAv6Oe','user','Marrakech','ENSA Marrakech','Génie informatique','Covoiturage régulier Marrakech-Casablanca.',4.6,TRUE,JSON_OBJECT()),
('Nour','Idrissi','nour.idrissi@example.com','$2a$12$7L8BvI69tWwH8oQHjqY.8ewhzHh9Q5HKEuS37NbwGs2j4P0mAv6Oe','user','Fès','Université Sidi Mohamed Ben Abdellah','Médecine','Documents de médecine et groupes de révision.',4.8,TRUE,JSON_OBJECT());

INSERT INTO housing_ads (user_id, title, description, type, city, school, field_of_study, address, price, rooms, available_from, images, amenities)
VALUES
(2, 'Chambre lumineuse près de l''UIR', 'Chambre meublée dans une colocation calme avec fibre et cuisine équipée.', 'chambre', 'Rabat', 'UIR', 'Toutes filières', 'Technopolis, Rabat', 1800, 1, '2026-06-01', JSON_ARRAY('/uploads/images/mock-housing-rabat.jpg'), JSON_ARRAY('Wi-Fi','Cuisine','Bureau')),
(3, 'Colocation moderne Guéliz', 'Appartement partagé entre étudiants ENSA, proche transport et charges incluses.', 'colocation', 'Marrakech', 'ENSA Marrakech', 'Génie informatique', 'Guéliz, Marrakech', 2100, 3, '2026-05-20', JSON_ARRAY('/uploads/images/mock-housing-marrakech.jpg'), JSON_ARRAY('Climatisation','Wi-Fi','Machine à laver'));

INSERT INTO marketplace_items (user_id, title, description, category, transaction_type, price, `condition`, city, school, field_of_study, images, document_url)
VALUES
(4, 'Pack PDF anatomie S2', 'Résumé clair avec schémas, QCM corrigés et fiches de révision.', 'document', 'vente', 60, 'numerique', 'Fès', 'Université Sidi Mohamed Ben Abdellah', 'Médecine', JSON_ARRAY('/uploads/images/mock-docs-medecine.jpg'), '/uploads/documents/mock-anatomie.pdf'),
(2, 'Livre marketing digital', 'Manuel récent avec notes en marge, parfait pour S4 commerce.', 'livre', 'vente', 120, 'bon', 'Rabat', 'UIR', 'Commerce', JSON_ARRAY('/uploads/images/mock-livre-marketing.jpg'), NULL);

INSERT INTO rides (user_id, departure_city, departure_address, destination_city, destination_address, departure_at, seats_total, seats_available, price_per_seat, car_model, notes, city, school)
VALUES
(3, 'Marrakech', 'ENSA Marrakech', 'Casablanca', 'Casa Voyageurs', '2026-05-18 08:30:00', 4, 3, 90, 'Dacia Sandero', 'Départ ponctuel, bagage moyen accepté.', 'Marrakech', 'ENSA Marrakech'),
(1, 'Casablanca', 'Maarif', 'Rabat', 'Agdal', '2026-05-20 17:45:00', 3, 2, 45, 'Renault Clio', 'Trajet après les cours.', 'Casablanca', 'EMSI Casablanca');

INSERT INTO events (user_id, title, description, event_type, city, school, field_of_study, venue, starts_at, ends_at, price, capacity, reserved_seats, poster_url)
VALUES
(2, 'ST00N Campus Night Rabat', 'Soirée networking, musique et rencontres entre écoles de Rabat.', 'soiree', 'Rabat', 'UIR', 'Toutes filières', 'Agdal', '2026-06-07 19:00:00', '2026-06-07 23:30:00', 120, 150, 37, '/uploads/images/mock-event-rabat.jpg'),
(1, 'Hackathon campus Casablanca', 'Compétition de prototypage React, Node et IA pour étudiants tech.', 'atelier', 'Casablanca', 'EMSI Casablanca', 'Informatique', 'EMSI Centre', '2026-06-21 09:00:00', '2026-06-21 19:00:00', 0, 80, 14, '/uploads/images/mock-hackathon.jpg');

INSERT INTO jobs (user_id, title, company, description, opportunity_type, work_mode, city, school, field_of_study, salary, deadline, skills, contact_email)
VALUES
(1, 'Stage développeur React/Node', 'CasaTech Labs', 'Stage PFE pour construire des interfaces React et APIs Express.', 'stage', 'hybride', 'Casablanca', 'EMSI Casablanca', 'Informatique', '2500 MAD/mois', '2026-06-30', JSON_ARRAY('React','Node.js','MySQL'), 'talent@casatech.ma'),
(3, 'Cours particuliers algorithmique', 'Étudiant indépendant', 'Sessions de soutien en C, JavaScript et structures de données.', 'service_freelance', 'remote', 'Marrakech', 'ENSA Marrakech', 'Génie informatique', '120 MAD/heure', NULL, JSON_ARRAY('Algorithmique','C','JavaScript'), 'omar.ait@example.com');
