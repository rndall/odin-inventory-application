import db from "../db/queries.js"
import CustomNotFoundError from "../errors/CustomNotFoundError.js"

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

export { getDevelopers, getDeveloperById }
