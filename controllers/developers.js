import { body, matchedData, validationResult } from "express-validator"
import db from "../db/queries.js"
import CustomNotFoundError from "../errors/CustomNotFoundError.js"
import normalizeIds from "../utils/normalizeIds.js"

const validateDeveloper = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Developer name is required.")
		.isString()
		.withMessage("Developer name must be a string.")
		.isLength({ max: 150 })
		.withMessage("Developer name must not exceed 150 characters."),
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

async function getDevelopers(_req, res) {
	const developers = await db.getAllDevelopers()
	console.log("Developers:", developers)
	res.json(developers)
}

async function getDeveloperById(req, res) {
	const { id } = req.params

	const developer = await db.getDeveloperById(Number(id))

	if (!developer) {
		throw new CustomNotFoundError("Developer not found!")
	}

	console.log("Developer:", developer)
	res.json(developer)
}

async function createDeveloperGet(_req, res) {
	const games = await db.getAllGames()

	res.render("form", {
		title: "Create New Developer",
		form: "developerForm",
		games,
		action: "/developers",
	})
}

const createDeveloperPost = [
	validateDeveloper,
	async (req, res) => {
		const { name, description, game_ids } = matchedData(req)

		const newDeveloper = { name, description, game_ids: normalizeIds(game_ids) }

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const games = await db.getAllGames()
			return res.status(400).render("form", {
				title: "Create New Developer",
				form: "developerForm",
				errors: errors.array(),
				developer: { ...req.body, game_ids: newDeveloper.game_ids || [] },
				games,
				action: "/developers",
			})
		}

		const { id } = await db.insertDeveloper(newDeveloper)
		res.redirect(`/developers/${id}`)
	},
]

async function updateDeveloperGet(req, res) {
	const developer = await db.getDeveloperById(Number(req.params.id))

	if (!developer) {
		throw new CustomNotFoundError("Developer not found!")
	}

	const games = await db.getAllGames()

	res.render("form", {
		title: "Update Developer",
		form: "developerForm",
		games,
		developer,
		action: `/developers/${developer.id}?_method=PUT`,
	})
}

const updateDeveloperPut = [
	validateDeveloper,
	async (req, res) => {
		const { id } = req.params
		const { name, description, game_ids } = matchedData(req)

		const updatedDeveloper = {
			name,
			description,
			game_ids: normalizeIds(game_ids),
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const games = await db.getAllGames()
			return res.status(400).render("form", {
				title: "Create New Developer",
				form: "developerForm",
				errors: errors.array(),
				developer: { ...req.body, game_ids: updatedDeveloper.game_ids || [] },
				games,
				action: `/developers/${id}?_method=PUT`,
			})
		}

		await db.updateDeveloper(id, updatedDeveloper)
		res.redirect(`/developers/${id}`)
	},
]

export {
	getDevelopers,
	getDeveloperById,
	createDeveloperGet,
	createDeveloperPost,
	updateDeveloperGet,
	updateDeveloperPut,
}
