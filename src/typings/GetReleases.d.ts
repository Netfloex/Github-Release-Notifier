interface ReleaseNode {
	id: string
	name: string
	description: string
	publishedAt: string
	url: string

	author: {
		avatarUrl: string
		name: string
		login: string
	}
}

export interface RepositoryNode {
	id: string
	name: string
	nameWithOwner: string
	url: string
	owner: {
		avatarUrl: string
	}
	releases: {
		nodes: ReleaseNode[]
	}
}

export interface GetReleases {
	nodes: RepositoryNode[]
}
