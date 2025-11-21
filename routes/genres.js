import { Router } from "express"
import {
	createGenreGet,
	createGenrePost,
	getGenreById,
	getGenres,
} from "../controllers/genres.js"

const router = Router()

/* GET genres listing. */
router.get("/", getGenres)

/* POST genre listing. */
router.post("/", createGenrePost)

/* GET genre form. */
router.get("/new", createGenreGet)

/* GET genre listing. */
router.get("/:id", getGenreById)

export default router
