#! /usr/bin/env node

import { Client } from "pg"

const SQL = `
CREATE TABLE IF NOT EXISTS genre (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO genre (name, description) VALUES
('Action RPG', 'Role-playing games with real-time action combat'),
('First-Person Shooter', 'Games played from a first-person perspective emphasizing shooting'),
('Open World', 'Games with large, freely explorable worlds'),
('Platformer', 'Games focused on jumping between platforms and precise movement'),
('Fighting', 'One-on-one or arena-based combat games'),
('Racing', 'High-speed vehicle racing games'),
('Strategy', 'Games emphasizing planning and tactical decisions'),
('Survival Horror', 'Horror games with resource management and survival elements'),
('Puzzle', 'Games that challenge the player with logic or pattern-based problems'),
('MMORPG', 'Massively multiplayer online role-playing games');


CREATE TABLE IF NOT EXISTS developer (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(150) NOT NULL,
  description TEXT
);

INSERT INTO developer (name, description) VALUES
('Nintendo', 'Japanese gaming giant famous for Mario, Zelda, and family-friendly titles'),
('Rockstar Games', 'Creators of Grand Theft Auto and Red Dead Redemption series'),
('CD Projekt Red', 'Polish studio known for The Witcher series and Cyberpunk 2077'),
('Valve Corporation', 'Creators of Half-Life, Portal, Counter-Strike, and Steam'),
('FromSoftware', 'Japanese studio famous for Dark Souls, Bloodborne, and Elden Ring'),
('Capcom', 'Japanese developer of Resident Evil, Monster Hunter, and Street Fighter'),
('Electronic Arts', 'Large publisher behind FIFA, Battlefield, and many sports titles'),
('Blizzard Entertainment', 'Creators of World of Warcraft, Overwatch, and Diablo'),
('Mojang Studios', 'Swedish studio that created Minecraft'),
('Supergiant Games', 'Indie studio behind Bastion, Transistor, Hades, and Pyre');


CREATE TABLE IF NOT EXISTS game (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  release_date DATE,
  description TEXT,
  cover_image_url VARCHAR(512)
);

INSERT INTO game (title, release_date, description, cover_image_url) VALUES
('The Legend of Zelda: Breath of the Wild', '2017-03-03', 'Open-air adventure in the kingdom of Hyrule', 'https://example.com/covers/zelda_botw.jpg'),
('Elden Ring', '2022-02-25', 'Open-world action RPG created by FromSoftware and George R.R. Martin', 'https://example.com/covers/elden_ring.jpg'),
('Grand Theft Auto V', '2013-09-17', 'Crime-filled open world set in Los Santos', 'https://example.com/covers/gta5.jpg'),
('The Witcher 3: Wild Hunt', '2015-05-19', 'Epic fantasy RPG following monster hunter Geralt of Rivia', 'https://example.com/covers/witcher3.jpg'),
('Hades', '2020-09-17', 'Roguelike dungeon crawler with Greek mythology theme', 'https://example.com/covers/hades.jpg'),
('Portal 2', '2011-04-19', 'First-person puzzle game using portal gun mechanics', 'https://example.com/covers/portal2.jpg'),
('Minecraft', '2011-11-18', 'Block-building sandbox game with infinite possibilities', 'https://example.com/covers/minecraft.jpg'),
('Cyberpunk 2077', '2020-12-10', 'Open-world RPG set in dystopian Night City', 'https://example.com/covers/cyberpunk2077.jpg'),
('Street Fighter 6', '2023-06-02', 'Latest entry in the legendary fighting game franchise', 'https://example.com/covers/sf6.jpg'),
('Half-Life 2', '2004-11-16', 'Iconic first-person shooter with groundbreaking physics and storytelling', 'https://example.com/covers/hl2.jpg');

CREATE TABLE IF NOT EXISTS game_genre (
  game_id INTEGER NOT NULL REFERENCES game(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genre(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'The Legend of Zelda: Breath of the Wild' AND gn.name IN ('Action RPG', 'Open World');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Elden Ring' AND gn.name IN ('Action RPG', 'Open World');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Grand Theft Auto V' AND gn.name IN ('Action RPG', 'Open World');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'The Witcher 3: Wild Hunt' AND gn.name IN ('Action RPG', 'Open World');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Hades' AND gn.name IN ('Action RPG');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Portal 2' AND gn.name IN ('Puzzle');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Minecraft' AND gn.name IN ('Open World');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Cyberpunk 2077' AND gn.name IN ('Action RPG', 'Open World', 'First-Person Shooter');

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Street Fighter 6' AND gn.name = 'Fighting';

INSERT INTO game_genre (game_id, genre_id)
SELECT g.id, gn.id FROM game g, genre gn WHERE g.title = 'Half-Life 2' AND gn.name IN ('First-Person Shooter');

CREATE TABLE IF NOT EXISTS game_developer (
  game_id INTEGER NOT NULL REFERENCES game(id) ON DELETE CASCADE,
  developer_id INTEGER NOT NULL REFERENCES developer(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, developer_id)
);

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'The Legend of Zelda: Breath of the Wild' AND d.name = 'Nintendo';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Elden Ring' AND d.name = 'FromSoftware';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Grand Theft Auto V' AND d.name = 'Rockstar Games';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'The Witcher 3: Wild Hunt' AND d.name = 'CD Projekt Red';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Hades' AND d.name = 'Supergiant Games';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Portal 2' AND d.name = 'Valve Corporation';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Minecraft' AND d.name = 'Mojang Studios';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Cyberpunk 2077' AND d.name = 'CD Projekt Red';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Street Fighter 6' AND d.name = 'Capcom';

INSERT INTO game_developer (game_id, developer_id)
SELECT g.id, d.id FROM game g, developer d WHERE g.title = 'Half-Life 2' AND d.name = 'Valve Corporation';
`

async function main() {
	console.log("seeding...")
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	})
	await client.connect()

	try {
		await client.query(SQL)
		console.log("done")
	} catch (err) {
		console.error(err)
	} finally {
		await client.end()
	}
}

main()
