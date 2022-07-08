interface Repository {
	nameWithOwner: string
	id: string
	releasesNotified?: string[]
}
export interface StoreSchema {
	repositories?: Repository[]
}
