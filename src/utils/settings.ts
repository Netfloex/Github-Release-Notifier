import { join, resolve } from "path"

const githubTokenTemp = process.env.GITHUB_TOKEN!
const repositoriesTemp =
	process.env.REPOSITORIES?.split(/[,\n]/).filter(Boolean)
const discordWebhooksTemp = process.env.DISCORD_WEBHOOKS?.split(/[,\n]/)

if (!githubTokenTemp || !repositoriesTemp || !discordWebhooksTemp) {
	throw new Error("Missing environment variables")
}

export const githubToken = githubTokenTemp
export const repositories = repositoriesTemp
export const discordWebhooks = discordWebhooksTemp

export const storePath = process.env.STORE_PATH
	? resolve(process.env.STORE_PATH)
	: join(process.cwd(), "data", "store.json")
