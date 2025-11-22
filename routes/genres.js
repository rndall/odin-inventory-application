import { Router } from "express"
import {
	createGenreGet,
	createGenrePost,
	deleteGenre,
	getGenreById,
	getGenres,
	updateGenreGet,
	updateGenrePut,
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

/* PUT genre listing. */
router.put("/:id", updateGenrePut)

/* DELETE genre listing. */
router.delete("/:id", deleteGenre)

/* GET genre update form. */
router.get("/:id/update", updateGenreGet)

export default router
