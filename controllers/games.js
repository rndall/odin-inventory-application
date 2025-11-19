import db from "../db/queries.js"
import CustomNotFoundError from "../errors/CustomNotFoundError.js"

async function getGames(_req, res) {
	const games = await db.getAllGames()
	console.log("Games:", games)
	res.json(games)
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

export { getGames, getGameById }
