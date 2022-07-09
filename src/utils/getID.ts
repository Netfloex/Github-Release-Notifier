import { getQueryPath } from "@utils/getQueryPath"
import { query } from "@utils/graphql"
import { store } from "@utils/store"

import chalk from "chalk"
import { readFile } from "fs-extra"

export const getID = async (nameWithOwner: string): Promise<string> => {
	store.data.repositories ??= []
	const cachedRepo = store.data.repositories.find(
		(r) => r.nameWithOwner == nameWithOwner,
	)
	if (cachedRepo) {
		console.log(
			chalk`ID of {dim ${nameWithOwner}} is {dim {bold ${cachedRepo.id}}}`,
		)
		return cachedRepo.id
	}

	const [owner, name] = nameWithOwner.split("/")
	console.log(chalk`{yellow Getting ID for {dim ${owner}}/{dim ${name}}...}`)
	if (!owner || !name) {
		throw new Error(chalk`There is no {dim /} in {dim ${nameWithOwner}}`)
	}

	const {
		repository: { id },
	} = await query(await readFile(getQueryPath("getID"), "utf-8"), {
		owner,
		name,
	})

	console.log(
		chalk`ID for {dim ${owner}}/{dim ${name}} is {dim {bold ${id}}}`,
	)

	store.data.repositories.push({
		id,
		nameWithOwner,
	})

	return id
}
