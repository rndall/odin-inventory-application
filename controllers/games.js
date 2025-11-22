import { body, matchedData, validationResult } from "express-validator"
import db from "../db/queries.js"
import CustomNotFoundError from "../errors/CustomNotFoundError.js"
import generateTable from "../utils/generateTable.js"
import normalizeIds from "../utils/normalizeIds.js"

const validateGame = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Game title is required.")
		.isString()
		.withMessage("Game title must be a string.")
		.isLength({ max: 255 })
		.withMessage("Game title must not exceed 255 characters."),
	body("release_date")
		.optional({ values: "falsy" })
		.trim()
		.isDate()
		.withMessage("Release date must be a date."),
	body("description")
		.optional({ values: "falsy" })
		.trim()
		.isString()
		.withMessage("Description must be a string.")
		.isLength({ max: 1000 })
		.withMessage("Description cannot exceed 1000 characters."),
	body("cover_image_url")
		.optional({ values: "falsy" })
		.trim()
		.isURL()
		.withMessage("Cover image must be a URL."),
	body("genre_ids")
		.optional({ values: "falsy" })
		.custom((value) => {
			if (value == null) return true

			const ids = Array.isArray(value) ? value : [value]

			return ids.every((id) => {
				const num = Number(id)
				return Number.isInteger(num)
			})
		})
		.withMessage("Genre IDs must be numbers"),
	body("developer_ids")
		.optional({ values: "falsy" })
		.custom((value) => {
			if (value == null) return true

			const ids = Array.isArray(value) ? value : [value]

			return ids.every((id) => {
				const num = Number(id)
				return Number.isInteger(num)
			})
		})
		.withMessage("Genre IDs must be numbers"),
]

async function getGames(_req, res) {
	const games = await db.getAllGames()
	console.log("Games:", games)
	res.locals = generateTable({ data: games, type: "Game" })

	res.render("manage", { title: "Manage Games" })
}

async function getGameById(req, res) {
	const { id } = req.params

	const game = await db.getGameById(Number(id))

	if (!game) {
		throw new CustomNotFoundError("Game not found!")
	}

	console.log("Game:", game)
	res.json(game)
}

async function createGameGet(_req, res) {
	const [genres, developers] = await Promise.all([
		db.getAllGenres(),
		db.getAllDevelopers(),
	])

	res.render("form", {
		title: "Create New Gaame",
		form: "gameForm",
		genres,
		developers,
		action: "/games",
	})
}

const createGamePost = [
	validateGame,
	async (req, res) => {
		const {
			title,
			release_date,
			cover_image_url,
			description,
			genre_ids,
			developer_ids,
		} = matchedData(req)

		const newGame = {
			title,
			release_date,
			cover_image_url,
			description,
			genre_ids: normalizeIds(genre_ids),
			developer_ids: normalizeIds(developer_ids),
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const [genres, developers] = await Promise.all([
				db.getAllGenres(),
				db.getAllDevelopers(),
			])
			return res.status(400).render("form", {
				title: "Create New Game",
				form: "gameForm",
				errors: errors.array(),
				genres,
				developers,
				game: {
					...req.body,
					genre_ids: newGame.genre_ids || [],
					developer_ids: newGame.developer_ids || [],
				},
				action: "/games",
			})
		}

		const { id } = await db.insertGame(newGame)
		res.redirect(`/games/${id}`)
	},
]

async function updateGameGet(req, res) {
	const game = await db.getGameById(Number(req.params.id))

	if (!game) {
		throw new CustomNotFoundError("Game not found!")
	}

	const [genres, developers] = await Promise.all([
		db.getAllGenres(),
		db.getAllDevelopers(),
	])

	res.render("form", {
		title: "Create New Gaame",
		form: "gameForm",
		game,
		genres,
		developers,
		action: `/games/${game.id}?_method=PUT`,
	})
}

const updateGamePut = [
	validateGame,
	async (req, res) => {
		const { id } = req.params
		const {
			title,
			release_date,
			cover_image_url,
			description,
			genre_ids,
			developer_ids,
		} = matchedData(req)

		const updatedGame = {
			title,
			release_date,
			cover_image_url,
			description,
			genre_ids: normalizeIds(genre_ids),
			developer_ids: normalizeIds(developer_ids),
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const [genres, developers] = await Promise.all([
				db.getAllGenres(),
				db.getAllDevelopers(),
			])
			return res.status(400).render("form", {
				title: "Create New Game",
				form: "gameForm",
				errors: errors.array(),
				genres,
				developers,
				game: {
					...req.body,
					genre_ids: updatedGame.genre_ids || [],
					developer_ids: updatedGame.developer_ids || [],
				},
				action: `/games/${id}?_method=PUT`,
			})
		}

		await db.updateGame(id, updatedGame)
		res.redirect(`/games/${id}`)
	},
]

async function deleteGame(req, res) {
	await db.deleteGame(Number(req.params.id))
	res.redirect("/games")
}

export {
	getGames,
	getGameById,
	createGameGet,
	createGamePost,
	updateGameGet,
	updateGamePut,
	deleteGame,
}
