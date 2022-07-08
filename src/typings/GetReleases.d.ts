interface ReleaseNode {
	id: string
	name: string
	description: string
	publishedAt: string
	url: string
}

export interface RepositoryNode {
	id: string
	name: string
	nameWithOwner: string
	releases: {
		nodes: ReleaseNode[]
	}
}

export interface GetReleases {
	nodes: RepositoryNode[]
}
