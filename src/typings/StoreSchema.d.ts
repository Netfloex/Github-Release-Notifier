interface Repository {
	nameWithOwner: string
	id: string
}
export interface StoreSchema {
	repositories?: Repository[]
}
