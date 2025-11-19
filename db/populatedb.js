#! /usr/bin/env node

import { Client } from "pg"

const SQL = ``

async function main() {
	console.log("seeding...")
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	})
	await client.connect()

	try {
		await client.query(SQL)
		console.log("done")
	} catch (err) {
		console.error(err)
	} finally {
		await client.end()
	}
}

main()
