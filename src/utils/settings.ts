import { join, resolve } from "path"

const githubTokenTemp = process.env.GITHUB_TOKEN!

if (!githubTokenTemp) {
	throw new Error("Missing Github Token")
}

export const githubToken = githubTokenTemp

export const storePath = process.env.STORE_PATH
	? resolve(process.env.STORE_PATH)
	: join(process.cwd(), "data", "store.json")

export const configPath = process.env.CONFIG_PATH
	? resolve(process.env.CONFIG_PATH)
	: join(process.cwd(), "config", "config.yml")
