// Dependency-free module that breaks the circular dependency:
//   thunks → api → api-client → get-redux-state → redux-store → slice → thunks
//
// Instead: api-client → get-redux-state → store-registry ← redux-store
//                                                    ↕ no deps

type StoreLike = { getState: () => unknown; dispatch: (action: unknown) => unknown }

let _store: StoreLike | null = null

export const registerStore = (store: StoreLike) => {
  _store = store
}

export const getStore = () => _store

export const getStoreNonNull = (): StoreLike => {
  if (!_store) throw new Error('Store not registered — call registerStore(store) during app init')
  return _store
}
