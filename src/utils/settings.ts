const githubTokenTemp = process.env.GITHUB_TOKEN!
const repositoriesTemp = process.env.REPOSITORIES?.split(",")
const discordWebhooksTemp = process.env.DISCORD_WEBHOOKS?.split(",")

if (!githubTokenTemp || !repositoriesTemp || !discordWebhooksTemp) {
	throw new Error("Missing environment variables")
}

export const githubToken = githubTokenTemp
export const repositories = repositoriesTemp
export const discordWebhooks = discordWebhooksTemp
