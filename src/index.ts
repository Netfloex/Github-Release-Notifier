import "dotenv/config"

import { getID } from "@utils/getID"
import { getReleases } from "@utils/getReleases"
import { repositories } from "@utils/settings"
import { store } from "@utils/store"

import chalk from "chalk"

const main = async (): Promise<void> => {
	store.data.repositories ??= []
	await store.init()

	const ids = await Promise.all(
		repositories.map(async (nameWithOwner) => await getID(nameWithOwner)),
	)

	const repos = await getReleases(ids)
	repos.forEach((repo) => {
		store.data.repositories ??= []
		const latestRelease = repo.releases.nodes[0]

		if (!latestRelease) {
			console.log(
				chalk`The repository {bold ${repo.nameWithOwner}} does not have any releases.`,
			)

			return
		}
		const cachedRepo = store.data.repositories.find((r) => r.id == repo.id)!
		cachedRepo.releasesNotified ??= []

		if (cachedRepo.releasesNotified.includes(latestRelease.id)) {
			return console.log(
				chalk`No new releases for {bold ${repo.nameWithOwner}}`,
			)
		}

		cachedRepo.releasesNotified.push(latestRelease.id)
		console.log(
			chalk`{bold NEW RELEASE} on {bold ${repo.nameWithOwner}}`,
			latestRelease,
		)
	})

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
