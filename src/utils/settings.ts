export const githubToken = process.env.GITHUB_TOKEN!
export const repositories = process.env.REPOSITORIES!.split(",")

if (!githubToken || !repositories) {
	throw new Error("Missing environment variables")
}
