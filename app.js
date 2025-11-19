import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import cookieParser from "cookie-parser"
import express, { json, static as static_, urlencoded } from "express"
import createError from "http-errors"
import logger from "morgan"

import developersRouter from "./routes/developers.js"
import genresRouter from "./routes/genres.js"
import indexRouter from "./routes/index.js"

const app = express()

// view engine setup
app.set("views", join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(static_(join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/developers", developersRouter)
app.use("/genres", genresRouter)

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
	next(createError(404))
})

// error handler
app.use((err, req, res, _next) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render("error")
})

export default app
