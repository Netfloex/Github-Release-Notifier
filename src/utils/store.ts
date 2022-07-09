import Store from "@lib/store"
import { storePath } from "@utils/settings"

import { StoreSchema } from "@typings/StoreSchema"

export const store = new Store<StoreSchema>(storePath, {})
