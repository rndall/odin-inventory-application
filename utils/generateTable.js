function generateTable({ data, type }) {
	let tableHeader = []
	let tableBody = []

	function actions(id) {
		return `
				<div class="flex gap-3">
					<a href="${id}/update">Edit</a>
					<form action="${id}?_method=DELETE" method="POST">
						<button type="submit" class="text-red-500 cursor-pointer">Delete</button>
					</form>
				</div>
			`
	}

	if (type.toLowerCase() === "game") {
		tableHeader = [`${type} Title`, "Genres", "Developers", ""]
		tableBody = data.map((d) => [
			d.title,
			d.genres.map(({ name }) => name).join(", "),
			d.developers.map(({ name }) => name).join(", "),
			actions(d.id),
		])
	} else {
		tableHeader = [`${type} Name`, "Game Count", "Actions"]
		tableBody = data.map((d) => [d.name, d.game_ids.length, actions(d.id)])
	}

	return {
		tableHeader,
		tableBody,
	}
}

export default generateTable
