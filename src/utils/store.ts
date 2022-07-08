import Store from "@lib/store"

import { StoreSchema } from "@typings/StoreSchema"

import { join } from "path"

const storePath = join(process.cwd(), "data", "store.json")
export const store = new Store<StoreSchema>(storePath, {})
