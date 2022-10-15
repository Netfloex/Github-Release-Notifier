import { getQueryPath } from "@utils/getQueryPath"
import { query } from "@utils/graphql"

import { GetReleases, RepositoryNode } from "@typings/GetReleases"

import { readFile } from "fs-extra"

export const getReleases = async (ids: string[]): Promise<RepositoryNode[]> => {
	const { nodes } = await query<GetReleases>(
		await readFile(getQueryPath("repositories"), "utf-8"),
		{
			ids,
			count: 1,
		},
	)

	return nodes
}
