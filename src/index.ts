import "dotenv/config"

import { getID } from "@utils/getID"
import { repositories } from "@utils/settings"
import { store } from "@utils/store"

import chalk from "chalk"

const main = async (): Promise<void> => {
	await store.init()
	const ids = await Promise.all(
		repositories.map(async (nameWithOwner) => await getID(nameWithOwner)),
	)
	console.log(ids)

	await store.write()
}

const started = Date.now()
main()
	.then(() => {
		console.log(chalk`{green Done} in ${Date.now() - started}s`)
	})
	.catch((error) => {
		console.log(chalk.red("There was an error"))
		throw error
	})
