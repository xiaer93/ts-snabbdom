import { PreHook, CreateHook, UpdateHook, DestroyHook, RemoveHook, PostHook } from './hook'

export interface Module {
  pre: PreHook
  create: CreateHook
  update: UpdateHook
  destroy: DestroyHook
  remove: RemoveHook
  post: PostHook
}
