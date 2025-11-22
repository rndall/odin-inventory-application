import pool from "./pool.js"

async function getAllGenres() {
	const { rows } = await pool.query(
		`
	    SELECT
				g.*,
				COALESCE(
			    ARRAY_AGG(gg.game_id) FILTER (WHERE gg.game_id IS NOT NULL),
					'{}'
				) AS game_ids
			FROM genre AS g
			LEFT JOIN game_genre AS gg
			  ON g.id = gg.genre_id
			GROUP BY g.id
			ORDER BY g.id
		`,
	)
	return rows
}

async function getGenreById(genreId) {
	const { rows } = await pool.query(
		`
	    SELECT
				g.*,
				COALESCE(
				  ARRAY_AGG(gg.game_id) FILTER (WHERE gg.game_id IS NOT NULL),
					'{}'
				) AS game_ids
			FROM genre AS g
			LEFT JOIN game_genre AS gg
				ON g.id = gg.genre_id
			WHERE g.id = $1
			GROUP BY g.id
    `,
		[genreId],
	)
	return rows[0] || null
}

async function insertGenre({ name, description = null, game_ids = [] }) {
	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		const { rows } = await client.query(
			`
	      INSERT INTO genre (name, description)
				VALUES ($1, $2)
				RETURNING *
			`,
			[name, description],
		)

		const genre = rows[0]

		await client.query(
			`
        INSERT INTO game_genre (game_id, genre_id)
        SELECT unnest($1::int[]), $2
      `,
			[game_ids, genre.id],
		)

		await client.query("COMMIT")

		return genre
	} catch (err) {
		console.error(err)
		throw err
	} finally {
		client.release()
	}
}

async function updateGenre(
	genreId,
	{ name, description = null, game_ids = [] },
) {
	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		await client.query(
			`
	      UPDATE genre
				SET name = $1,
				  description = $2
				WHERE id = $3
			`,
			[name, description, genreId],
		)

		await client.query(
			`
        DELETE FROM game_genre
        WHERE genre_id = $1
      `,
			[genreId],
		)

		await client.query(
			`
        INSERT INTO game_genre (game_id, genre_id)
        SELECT unnest($1::int[]), $2
      `,
			[game_ids, genreId],
		)

		await client.query("COMMIT")
	} catch (err) {
		console.error(err)
		throw err
	} finally {
		client.release()
	}
}

async function deleteGenre(genreId) {
	await pool.query("DELETE FROM genre WHERE id = $1", [genreId])
}

async function getAllDevelopers() {
	const { rows } = await pool.query(`
    SELECT
      d.*,
      COALESCE(
        ARRAY_AGG(gd.game_id) FILTER (WHERE gd.game_id IS NOT NULL),
        '{}'
      ) AS game_ids
    FROM developer AS d
    LEFT JOIN game_developer AS gd
      ON d.id = gd.developer_id
    GROUP BY d.id
    ORDER BY d.id
  `)
	return rows
}

async function getDeveloperById(developerId) {
	const { rows } = await pool.query(
		`
  	  SELECT d.*,
   		  COALESCE(
          ARRAY_AGG(gd.game_id) FILTER (WHERE gd.game_id IS NOT NULL),
          '{}'
        ) AS game_ids
  		FROM developer AS d
  		LEFT JOIN game_developer AS gd
  		  ON d.id = gd.developer_id
  		WHERE d.id = $1
  		GROUP BY d.id
    `,
		[developerId],
	)
	return rows[0] || null
}

async function insertDeveloper({ name, description = null, game_ids = [] }) {
	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		const { rows } = await client.query(
			`
	      INSERT INTO developer (name, description)
				VALUES ($1, $2)
				RETURNING *
			`,
			[name, description],
		)

		const developer = rows[0]

		await client.query(
			`
        INSERT INTO game_developer (game_id, developer_id)
        SELECT unnest($1::int[]), $2
      `,
			[game_ids, developer.id],
		)

		await client.query("COMMIT")

		return developer
	} catch (err) {
		console.error(err)
		throw err
	} finally {
		client.release()
	}
}

async function updateDeveloper(
	developerId,
	{ name, description = null, game_ids = [] },
) {
	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		await client.query(
			`
	      UPDATE developer
				SET name = $1,
				  description = $2
				WHERE id = $3
			`,
			[name, description, developerId],
		)

		await client.query(
			`
        DELETE FROM game_developer
        WHERE developer_id = $1
      `,
			[developerId],
		)

		await client.query(
			`
        INSERT INTO game_developer (game_id, developer_id)
        SELECT unnest($1::int[]), $2
      `,
			[game_ids, developerId],
		)

		await client.query("COMMIT")
	} catch (err) {
		console.error(err)
		throw err
	} finally {
		client.release()
	}
}

async function deleteDeveloper(developerId) {
	await pool.query("DELETE FROM developer WHERE id = $1", [developerId])
}

async function getAllGames() {
	const { rows } = await pool.query(`
    SELECT
      ga.id,
      ga.title,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', ge.id,
        'name', ge.name
      )) FILTER (WHERE ge.id IS NOT NULL), '[]') AS genres,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', d.id,
        'name', d.name
      )) FILTER (WHERE d.id IS NOT NULL), '[]') AS developers
    FROM game AS ga
    LEFT JOIN game_genre AS gg
      ON ga.id = gg.game_id
    LEFT JOIN genre AS ge
      ON gg.genre_id = ge.id
    LEFT JOIN game_developer AS gd
      ON ga.id = gd.game_id
    LEFT JOIN developer AS d
      ON gd.developer_id = d.id
    GROUP BY ga.id
    ORDER BY ga.id
  `)
	return rows
}

async function getGameById(gameId) {
	const { rows } = await pool.query(
		`
  		SELECT
        ga.*,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
            'id', ge.id,
            'name', ge.name
          )) FILTER (WHERE ge.id IS NOT NULL), '[]') AS genres,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'id', d.id,
          'name', d.name
        )) FILTER (WHERE d.id IS NOT NULL), '[]') AS developers
      FROM game AS ga
      LEFT JOIN game_genre AS gg
        ON ga.id = gg.game_id
      LEFT JOIN genre AS ge
        ON gg.genre_id = ge.id
      LEFT JOIN game_developer AS gd
        ON ga.id = gd.game_id
      LEFT JOIN developer AS d
        ON gd.developer_id = d.id
      WHERE ga.id = $1
      GROUP BY ga.id
    `,
		[gameId],
	)
	return rows[0] || null
}

async function insertGame({
	title,
	release_date = null,
	description = null,
	cover_image_url = null,
	genre_ids = [],
	developer_ids = [],
}) {
	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		const { rows } = await client.query(
			`
  	    INSERT INTO game (title, release_date, description, cover_image_url)
  			VALUES ($1, $2, $3, $4)
  			RETURNING *
			`,
			[title, release_date, description, cover_image_url],
		)

		const game = rows[0]

		await client.query(
			`
        INSERT INTO game_genre (game_id, genre_id)
        SELECT $1, unnest($2::int[])
      `,
			[game.id, genre_ids],
		)

		await client.query(
			`
        INSERT INTO game_developer (game_id, developer_id)
        SELECT $1, unnest($2::int[])
      `,
			[game.id, developer_ids],
		)

		await client.query("COMMIT")

		return game
	} catch (err) {
		console.error(err)
		throw err
	} finally {
		client.release()
	}
}

async function updateGame(
	gameId,
	{
		title,
		release_date = null,
		description = null,
		cover_image_url = null,
		genre_ids = [],
		developer_ids = [],
	},
) {
	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		await client.query(
			`
	      UPDATE game
				SET title = $1,
				  release_date = $2,
				  description = $3,
					cover_image_url = $4
				WHERE id = $5
			`,
			[title, release_date, description, cover_image_url, gameId],
		)

		await client.query(
			`
        DELETE FROM game_developer
        WHERE game_id = $1
      `,
			[gameId],
		)

		await client.query(
			`
        DELETE FROM game_genre
        WHERE game_id = $1
      `,
			[gameId],
		)

		await client.query(
			`
        INSERT INTO game_genre (game_id, genre_id)
        SELECT $1, unnest($2::int[])
      `,
			[gameId, genre_ids],
		)

		await client.query(
			`
        INSERT INTO game_developer (game_id, developer_id)
        SELECT $1, unnest($2::int[])
      `,
			[gameId, developer_ids],
		)

		await client.query("COMMIT")
	} catch (err) {
		console.error(err)
		throw err
	} finally {
		client.release()
	}
}

export default {
	getAllGenres,
	getGenreById,
	insertGenre,
	updateGenre,
	deleteGenre,
	getAllDevelopers,
	getDeveloperById,
	insertDeveloper,
	updateDeveloper,
	deleteDeveloper,
	getAllGames,
	getGameById,
	insertGame,
	updateGame,
}
