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

export default { getAllGenres, getGenreById }
