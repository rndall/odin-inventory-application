import { body, matchedData, validationResult } from "express-validator"
import db from "../db/queries.js"
import CustomNotFoundError from "../errors/CustomNotFoundError.js"

const validateGenre = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Genre name is required.")
		.isString()
		.withMessage("Genre name must be a string.")
		.isLength({ max: 50 })
		.withMessage("Genre name must not exceed 50 characters."),
	body("description")
		.optional({ values: "falsy" })
		.trim()
		.isString()
		.withMessage("Description must be a string.")
		.isLength({ max: 1000 })
		.withMessage("Description cannot exceed 1000 characters."),
	body("game_ids")
		.optional({ values: "falsy" })
		.custom((value) => {
			if (value == null) return true

			const ids = Array.isArray(value) ? value : [value]

			return ids.every((id) => {
				const num = Number(id)
				return Number.isInteger(num)
			})
		})
		.withMessage("Game IDs must be numbers"),
]

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

async function createGenreGet(_req, res) {
	const games = await db.getAllGames()

	res.render("form", { title: "Create New Genre", form: "genreForm", games })
}

const createGenrePost = [
	validateGenre,
	async (req, res) => {
		const { name, description, game_ids } = matchedData(req)
		const newGenre = { name, description, game_ids }

		if (!game_ids) {
		} else if (Array.isArray(game_ids)) {
			newGenre.game_ids = game_ids.map((game_id) => Number(game_id))
		} else {
			newGenre.game_ids = [Number(game_ids)]
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const games = await db.getAllGames()
			return res.status(400).render("form", {
				title: "Create New Genre",
				form: "genreForm",
				errors: errors.array(),
				genre: { ...req.body, game_ids: newGenre.game_ids || [] },
				games,
			})
		}

		const { id } = await db.insertGenre(newGenre)
		res.redirect(`/genres/${id}`)
	},
]

export { getGenres, getGenreById, createGenreGet, createGenrePost }
