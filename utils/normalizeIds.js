function normalizeIds(value) {
	if (!value) {
		return []
	}

	if (Array.isArray(value)) {
		return value.map((v) => Number(v))
	}

	return [Number(value)]
}

export default normalizeIds
