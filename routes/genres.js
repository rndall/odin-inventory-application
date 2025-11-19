import { Router } from "express"
import { getGenreById, getGenres } from "../controllers/genres.js"

const router = Router()

/* GET genres listing. */
router.get("/", getGenres)

/* GET genre listing. */
router.get("/:id", getGenreById)

export default router
