import { Router } from "express"
import {
	createGameGet,
	createGamePost,
	deleteGame,
	getGameById,
	getGames,
	updateGameGet,
	updateGamePut,
} from "../controllers/games.js"

const router = Router()

/* GET games listing. */
router.get("/", getGames)

/* POST game listing. */
router.post("/", createGamePost)

/* GET game form. */
router.get("/new", createGameGet)

/* GET game listing. */
router.get("/:id", getGameById)

/* PUT game listing. */
router.put("/:id", updateGamePut)

/* DELETE game listing. */
router.delete("/:id", deleteGame)

/* GET game update form. */
router.get("/:id/update", updateGameGet)

export default router
