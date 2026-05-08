CREATE DATABASE IF NOT EXISTS stoon_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stoon_db;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  photo VARCHAR(255) NULL,
  city VARCHAR(80) NOT NULL,
  school VARCHAR(160) NOT NULL,
  field_of_study VARCHAR(120) NOT NULL,
  bio TEXT NULL,
  reputation FLOAT NOT NULL DEFAULT 4.5,
  email_verified BOOLEAN NOT NULL DEFAULT TRUE,
  preferences JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_city (city),
  INDEX idx_users_school (school),
  INDEX idx_users_field (field_of_study),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE housing_ads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('chambre','studio','appartement','colocation') NOT NULL DEFAULT 'colocation',
  city VARCHAR(80) NOT NULL,
  school VARCHAR(160) NOT NULL,
  field_of_study VARCHAR(120) NULL,
  address VARCHAR(220) NOT NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  price DECIMAL(10,2) NOT NULL,
  rooms INT UNSIGNED NOT NULL DEFAULT 1,
  available_from DATE NOT NULL,
  images JSON NOT NULL,
  amenities JSON NOT NULL,
  status ENUM('active','reserved','archived') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_housing_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_housing_city (city),
  INDEX idx_housing_school (school),
  INDEX idx_housing_price (price),
  INDEX idx_housing_status (status)
) ENGINE=InnoDB;

CREATE TABLE marketplace_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('document','livre','materiel','electronique','autre') NOT NULL,
  transaction_type ENUM('vente','achat') NOT NULL DEFAULT 'vente',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  `condition` ENUM('neuf','tres_bon','bon','acceptable','numerique') NOT NULL DEFAULT 'bon',
  city VARCHAR(80) NOT NULL,
  school VARCHAR(160) NOT NULL,
  field_of_study VARCHAR(120) NULL,
  images JSON NOT NULL,
  document_url VARCHAR(255) NULL,
  status ENUM('active','sold','archived') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_marketplace_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_marketplace_category (category),
  INDEX idx_marketplace_city (city),
  INDEX idx_marketplace_school (school),
  INDEX idx_marketplace_status (status)
) ENGINE=InnoDB;

CREATE TABLE rides (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  departure_city VARCHAR(80) NOT NULL,
  departure_address VARCHAR(220) NOT NULL,
  destination_city VARCHAR(80) NOT NULL,
  destination_address VARCHAR(220) NOT NULL,
  departure_at DATETIME NOT NULL,
  seats_total INT UNSIGNED NOT NULL,
  seats_available INT UNSIGNED NOT NULL,
  price_per_seat DECIMAL(10,2) NOT NULL DEFAULT 0,
  car_model VARCHAR(120) NULL,
  notes TEXT NULL,
  city VARCHAR(80) NOT NULL,
  school VARCHAR(160) NOT NULL,
  status ENUM('active','full','cancelled','archived') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rides_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_rides_route (departure_city, destination_city),
  INDEX idx_rides_date (departure_at),
  INDEX idx_rides_school (school),
  INDEX idx_rides_status (status)
) ENGINE=InnoDB;

CREATE TABLE events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  event_type ENUM('conference','atelier','soiree','sport','voyage','culture') NOT NULL DEFAULT 'conference',
  city VARCHAR(80) NOT NULL,
  school VARCHAR(160) NOT NULL,
  field_of_study VARCHAR(120) NULL,
  venue VARCHAR(220) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  capacity INT UNSIGNED NOT NULL DEFAULT 40,
  reserved_seats INT UNSIGNED NOT NULL DEFAULT 0,
  poster_url VARCHAR(255) NULL,
  status ENUM('active','full','cancelled','archived') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_events_city (city),
  INDEX idx_events_school (school),
  INDEX idx_events_date (starts_at),
  INDEX idx_events_status (status)
) ENGINE=InnoDB;

CREATE TABLE jobs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  company VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  opportunity_type ENUM('stage','job_etudiant','service_freelance') NOT NULL,
  work_mode ENUM('presentiel','hybride','remote') NOT NULL DEFAULT 'hybride',
  city VARCHAR(80) NOT NULL,
  school VARCHAR(160) NULL,
  field_of_study VARCHAR(120) NULL,
  salary VARCHAR(120) NULL,
  deadline DATE NULL,
  skills JSON NOT NULL,
  contact_email VARCHAR(160) NOT NULL,
  status ENUM('active','closed','archived') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_jobs_type (opportunity_type),
  INDEX idx_jobs_city (city),
  INDEX idx_jobs_field (field_of_study),
  INDEX idx_jobs_status (status)
) ENGINE=InnoDB;

CREATE TABLE conversations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NULL,
  last_message_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_conversations_last_message (last_message_at)
) ENGINE=InnoDB;

CREATE TABLE conversation_participants (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  last_read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cp_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_conversation_user (conversation_id, user_id)
) ENGINE=InnoDB;

CREATE TABLE messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT UNSIGNED NOT NULL,
  sender_id INT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  attachments JSON NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_messages_conversation (conversation_id),
  INDEX idx_messages_sender (sender_id),
  INDEX idx_messages_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reviewer_id INT UNSIGNED NOT NULL,
  target_user_id INT UNSIGNED NOT NULL,
  rating INT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_target FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_reviews_target (target_user_id),
  INDEX idx_reviews_reviewer (reviewer_id)
) ENGINE=InnoDB;

CREATE TABLE favorites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  item_type ENUM('housing','marketplace','ride','event','job') NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_favorite_user_item (user_id, item_type, item_id)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  resource_type ENUM('ride','event') NOT NULL,
  resource_id INT UNSIGNED NOT NULL,
  seats INT UNSIGNED NOT NULL DEFAULT 1,
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_bookings_resource (resource_type, resource_id),
  INDEX idx_bookings_status (status)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  body TEXT NOT NULL,
  type ENUM('message','booking','review','system','report') NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_read (is_read),
  INDEX idx_notifications_type (type)
) ENGINE=InnoDB;

CREATE TABLE reports (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT UNSIGNED NOT NULL,
  item_type ENUM('housing','marketplace','ride','event','job','message','user') NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  reason VARCHAR(240) NOT NULL,
  status ENUM('open','reviewing','resolved') NOT NULL DEFAULT 'open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_user FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reports_item (item_type, item_id),
  INDEX idx_reports_status (status)
) ENGINE=InnoDB;
