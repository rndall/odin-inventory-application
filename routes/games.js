import { Router } from "express"
import {
	createGameGet,
	createGamePost,
	getGameById,
	getGames,
} from "../controllers/games.js"

const router = Router()

/* GET developers listing. */
router.get("/", getGames)

/* POST developer listing. */
router.post("/", createGamePost)

/* GET developer form. */
router.get("/new", createGameGet)

/* GET developer listing. */
router.get("/:id", getGameById)

export default router
