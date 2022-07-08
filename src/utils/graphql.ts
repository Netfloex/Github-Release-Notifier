import { githubToken } from "@utils/settings"

import { graphql } from "@octokit/graphql"

export const query = graphql.defaults({
	headers: {
		authorization: `token ${githubToken}`,
	},
})
