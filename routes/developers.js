import { Router } from "express"
import {
	createDeveloperGet,
	createDeveloperPost,
	getDeveloperById,
	getDevelopers,
} from "../controllers/developers.js"

const router = Router()

/* GET developers listing. */
router.get("/", getDevelopers)

/* POST developer listing. */
router.post("/", createDeveloperPost)

/* GET developer form. */
router.get("/new", createDeveloperGet)

/* GET developer listing. */
router.get("/:id", getDeveloperById)

export default router
