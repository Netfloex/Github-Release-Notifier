import "dotenv/config"

import { getID } from "@utils/getID"
import { getReleases } from "@utils/getReleases"
import { discordWebhooks, repositories } from "@utils/settings"
import { store } from "@utils/store"

import axios from "axios"
import chalk from "chalk"

const main = async (): Promise<void> => {
	store.data.repositories ??= []
	await store.init()

	const ids = await Promise.all(
		repositories.map(async (nameWithOwner) => await getID(nameWithOwner)),
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

			if (cachedRepo.releasesNotified.includes(latestRelease.id)) {
				return console.log(
					chalk`No new releases for {bold ${repo.nameWithOwner}}`,
				)
			}

			cachedRepo.releasesNotified.push(latestRelease.id)
			console.log(
				chalk`New Release on {bold ${repo.nameWithOwner}} {green ${latestRelease.name}}`,
			)

			await axios.post(discordWebhooks[0], {
				embeds: [
					{
						title: latestRelease.name,
						description: latestRelease.description,
						url: latestRelease.url,
						color: 3309752,
						author: {
							name: repo.nameWithOwner,
							icon_url: repo.owner.avatarUrl,
							url: repo.url,
						},
					},
				],
				username:
					latestRelease.author.name ?? latestRelease.author.login,
				avatar_url: latestRelease.author.avatarUrl,
			})
		}),
	)
	await store.write()
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
		throw error
	})
