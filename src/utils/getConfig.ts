import { configPath } from "@utils/settings"

import { configSchema } from "@schemas/configSchema"
import chalk from "chalk"
import { pathExists, readFile } from "fs-extra"
import { load, YAMLException } from "js-yaml"
import { z } from "zod"

export const getConfig = async (): Promise<
	z.output<typeof configSchema> | false
> => {
	if (!(await pathExists(configPath))) {
		console.log(chalk`The config file could not be found: {dim configPath}`)

		return false
	}

	const content = await readFile(configPath, "utf-8")

	try {
		const data = load(content) as Record<string, unknown>

		const parsed = configSchema.safeParse(data)

		if (!parsed.success) {
			console.error("Error validating config:")

			console.error(parsed.error)
			return false
		}

		return parsed.data
	} catch (error) {
		if (error instanceof YAMLException) {
			console.log(
				chalk`Yaml Error: {dim ${error.reason}}:\n${error.mark.snippet}`,
			)
		} else {
			console.error(error)
		}
	}

	return false
}
