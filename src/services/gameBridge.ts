import type { GameBridgeEventName, GameBridgeEvent } from '../types/game'

/**
 * gameBridge.ts – Jembatan Event Bus antara UI React dan Game Client Canvas (Divisi 5)
 * Berkomunikasi via CustomEvent berbasis window.
 */

type BridgeHandler = (payload: Record<string, unknown>) => void

const handlers: Partial<Record<GameBridgeEventName, BridgeHandler[]>> = {}

/** Emit event dari UI ke Canvas (atau dari Canvas ke UI) */
export function emitBridgeEvent(event: GameBridgeEventName, payload: Record<string, unknown> = {}): void {
  const detail: GameBridgeEvent = { event, payload }
  window.dispatchEvent(new CustomEvent('SUNDA_BRIDGE', { detail }))
}

/** Subscribe ke event tertentu */
export function onBridgeEvent(event: GameBridgeEventName, handler: BridgeHandler): () => void {
  if (!handlers[event]) handlers[event] = []
  handlers[event]!.push(handler)

  const listener = (e: Event) => {
    const ce = e as CustomEvent<GameBridgeEvent>
    if (ce.detail.event === event) handler(ce.detail.payload)
  }
  window.addEventListener('SUNDA_BRIDGE', listener)

  // Return cleanup function
  return () => {
    window.removeEventListener('SUNDA_BRIDGE', listener)
    if (handlers[event]) {
      handlers[event] = handlers[event]!.filter(h => h !== handler)
    }
  }
}
