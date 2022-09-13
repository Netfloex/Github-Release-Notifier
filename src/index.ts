import "dotenv/config"

import { getConfig } from "@utils/getConfig"
import { getID } from "@utils/getID"
import { getReleases } from "@utils/getReleases"
import { store } from "@utils/store"

import axios from "axios"
import chalk from "chalk"

const main = async (): Promise<void> => {
	const config = await getConfig()

	if (!config) {
		console.log(chalk`There was an error reading the config, exiting...`)
		return
	}

	store.data.repositories ??= []
	await store.init()

	await Promise.all(
		Object.values(config).map(async (category) => {
			const ids = await Promise.all(
				category.repositories.map(
					async (nameWithOwner) => await getID(nameWithOwner),
				),
			)

			const repos = await getReleases(ids)
			await Promise.all(
				repos.map(async (repo) => {
					store.data.repositories ??= []
					const latestRelease = repo.releases.nodes[0]

					if (!latestRelease) {
						console.log(
							chalk`The repository {bold ${repo.nameWithOwner}} does not have any releases.`,
						)

						return
					}
					const cachedRepo = store.data.repositories.find(
						(r) => r.id == repo.id,
					)!
					cachedRepo.releasesNotified ??= []

					if (
						cachedRepo.releasesNotified.includes(latestRelease.id)
					) {
						return console.log(
							chalk`No new releases for {bold ${repo.nameWithOwner}}`,
						)
					}

					console.log(
						chalk`New Release on {bold ${repo.nameWithOwner}} {green ${latestRelease.name}}`,
					)

					latestRelease.description ??= ""

					for (const hook of category.hooks) {
						console.log(latestRelease)

						await axios.post(hook, {
							embeds: [
								{
									title: latestRelease.name,
									description:
										latestRelease.description.length >= 2000
											? latestRelease.description.slice(
													0,
													1900,
											  ) +
											  "\n--- This message has been trimmed ---"
											: latestRelease.description,
									url: latestRelease.url,
									color: 3309752,
									author: {
										name: repo.nameWithOwner,
										icon_url: repo.owner.avatarUrl,
										url: repo.url,
									},
									timestamp: latestRelease.publishedAt,
								},
							],
							username:
								latestRelease.author.name ??
								latestRelease.author.login,
							avatar_url: latestRelease.author.avatarUrl,
						})
					}

					cachedRepo.releasesNotified.push(latestRelease.id)
					await store.write()
				}),
			)
		}),
	)
}

const started = Date.now()
main()
	.then(() => {
		console.log(
			chalk`{green Done} in {yellow ${(Date.now() - started) / 1000}s}`,
		)
	})
	.catch((error) => {
		console.log(chalk.red("There was an error"))
		console.error(error)
		if (axios.isAxiosError(error)) {
			console.log("Axios Response:")
			console.error(error.response!.data)
		}
	})
