import { Router } from "express"
import { getDeveloperById, getDevelopers } from "../controllers/developers.js"

const router = Router()

/* GET developers listing. */
router.get("/", getDevelopers)

/* GET developer listing. */
router.get("/:id", getDeveloperById)

export default router
