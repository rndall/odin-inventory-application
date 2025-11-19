import db from "../db/queries.js"
import CustomNotFoundError from "../errors/CustomNotFoundError.js"

async function getGenres(_req, res) {
	const genres = await db.getAllGenres()
	console.log("Genres:", genres)
	res.json(genres)
}

async function getGenreById(req, res) {
	const { id } = req.params

	const genre = await db.getGenreById(Number(id))

	if (!genre) {
		throw new CustomNotFoundError("Genre not found!")
	}

	console.log("Genre:", genre)
	res.json(genre)
}

export { getGenres, getGenreById }
