-- football_arena_db.sql
-- Database schema for Football Arena application

-- Create database
CREATE DATABASE IF NOT EXISTS football_arena;
USE football_arena;

-- Users table 
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    country VARCHAR(50),
    favorite_team VARCHAR(50),
    profile_image VARCHAR(255),
    account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teams table
CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    short_code VARCHAR(5),
    country VARCHAR(50) NOT NULL,
    founded_year INT,
    stadium_name VARCHAR(100),
    logo_url VARCHAR(255),
    league_id INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leagues table
CREATE TABLE leagues (
    league_id INT AUTO_INCREMENT PRIMARY KEY,
    league_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    season VARCHAR(20) NOT NULL,
    logo_url VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Matches table
CREATE TABLE matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    league_id INT NOT NULL,
    match_date DATETIME NOT NULL,
    venue VARCHAR(100),
    home_score INT,
    away_score INT,
    status ENUM('scheduled', 'ongoing', 'completed', 'postponed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (league_id) REFERENCES leagues(league_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Players table
CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(50),
    position ENUM('GK', 'DEF', 'MID', 'FWD') NOT NULL,
    current_team_id INT,
    jersey_number INT,
    height_cm INT,
    weight_kg INT,
    profile_image VARCHAR(255),
    FOREIGN KEY (current_team_id) REFERENCES teams(team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User favorites (many-to-many relationship)
CREATE TABLE user_favorites (
    user_id INT NOT NULL,
    team_id INT NOT NULL,
    player_id INT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News/articles table
CREATE TABLE news (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    category ENUM('transfer', 'match', 'league', 'team', 'player') NOT NULL,
    related_team_id INT,
    related_player_id INT,
    views INT DEFAULT 0,
    FOREIGN KEY (related_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (related_player_id) REFERENCES players(player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User comments on news
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    news_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id INT NULL,
    FOREIGN KEY (news_id) REFERENCES news(news_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for better performance
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_team_name ON teams(team_name);
CREATE INDEX idx_player_name ON players(full_name);
CREATE INDEX idx_match_date ON matches(match_date);
CREATE INDEX idx_news_date ON news(publish_date);

-- Insert sample leagues
INSERT INTO leagues (league_name, country, season, logo_url) VALUES
('Premier League', 'England', '2023-2024', 'https://example.com/logos/premier_league.png'),
('La Liga', 'Spain', '2023-2024', 'https://example.com/logos/la_liga.png'),
('Bundesliga', 'Germany', '2023-2024', 'https://example.com/logos/bundesliga.png');

-- Insert sample teams
INSERT INTO teams (team_name, short_code, country, founded_year, stadium_name, league_id) VALUES
('Arsenal', 'ARS', 'England', 1886, 'Emirates Stadium', 1),
('Manchester United', 'MUN', 'England', 1878, 'Old Trafford', 1),
('Real Madrid', 'RMA', 'Spain', 1902, 'Santiago Bernabéu', 2),
('Barcelona', 'FCB', 'Spain', 1899, 'Camp Nou', 2),
('Bayern Munich', 'FCB', 'Germany', 1900, 'Allianz Arena', 3);

-- Insert sample players
INSERT INTO players (full_name, date_of_birth, nationality, position, current_team_id, jersey_number) VALUES
('Bukayo Saka', '2001-09-05', 'England', 'FWD', 1, 7),
('Bruno Fernandes', '1994-09-08', 'Portugal', 'MID', 2, 8),
('Vinicius Junior', '2000-07-12', 'Brazil', 'FWD', 3, 7),
('Robert Lewandowski', '1988-08-21', 'Poland', 'FWD', 4, 9),
('Harry Kane', '1993-07-28', 'England', 'FWD', 5, 9);

-- Create a stored procedure for user registration
DELIMITER //
CREATE PROCEDURE register_user(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_full_name VARCHAR(100),
    IN p_dob DATE,
    IN p_country VARCHAR(50),
    IN p_fav_team VARCHAR(50)
BEGIN
    DECLARE team_id INT DEFAULT NULL;
    
    -- Check if favorite team exists
    IF p_fav_team IS NOT NULL THEN
        SELECT team_id INTO team_id FROM teams WHERE team_name = p_fav_team LIMIT 1;
    END IF;
    
    -- Insert user
    INSERT INTO users (username, password_hash, full_name, date_of_birth, country, favorite_team)
    VALUES (p_username, p_password, p_full_name, p_dob, p_country, p_fav_team);
    
    -- Add to favorites if team exists
    IF team_id IS NOT NULL THEN
        INSERT INTO user_favorites (user_id, team_id)
        VALUES (LAST_INSERT_ID(), team_id);
    END IF;
END //
DELIMITER ;

-- Create view for active users
CREATE VIEW active_users AS
SELECT user_id, username, full_name, country, last_login
FROM users
WHERE last_login >= DATE_SUB(NOW(), INTERVAL 6 MONTH);