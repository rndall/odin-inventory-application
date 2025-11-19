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

export default {
	getAllGenres,
	getGenreById,
	getAllDevelopers,
	getDeveloperById,
	getAllGames,
	getGameById,
}
