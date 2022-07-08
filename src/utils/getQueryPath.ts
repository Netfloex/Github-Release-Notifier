import { join } from "path"

export const getQueryPath = (queryName: string): string =>
	join(process.cwd(), "src", "queries", queryName + ".gql")
