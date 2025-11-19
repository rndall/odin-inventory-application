import { Router } from "express"
import { getGameById, getGames } from "../controllers/games.js"

const router = Router()

/* GET developers listing. */
router.get("/", getGames)

/* GET developer listing. */
router.get("/:id", getGameById)

export default router
