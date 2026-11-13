// Jembatan komunikasi event DOM antara UI React dan Game Canvas (Divisi 5) / Socket (Divisi 6)

export type GameBridgeEvent =
  | 'ENGKLEK_GACUK_THROWN'
  | 'ENGKLEK_HOP_STEP'
  | 'ENGKLEK_LINE_STEPPED'
  | 'ENGKLEK_SAWAH_CLAIMED'
  | 'ENGKLEK_TAX_PAID'
  | 'ENGKLEK_GAME_OVER'
  | 'ORAY_GATE_CLOSING'
  | 'ORAY_GATE_CLOSED'
  | 'ORAY_RESCUE_TRIGGER'
  | 'TUG_OF_WAR_TICK'

export interface BridgePayload<T = unknown> {
  type: GameBridgeEvent
  data: T
  timestamp: number
}

class GameBridge {
  private listeners: Map<string, Array<(payload: BridgePayload) => void>> = new Map()

  public emit<T>(event: GameBridgeEvent, data: T) {
    const payload: BridgePayload<T> = {
      type: event,
      data,
      timestamp: Date.now(),
    }

    // Panggil listener internal
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach((h) => h(payload as BridgePayload))
    }

    // Broadcast ke window untuk Divisi 5 (Game Canvas Phaser/PixiJS)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('SUNDA_GAME_BRIDGE', { detail: payload }))
    }
  }

  public on(event: GameBridgeEvent, handler: (payload: BridgePayload) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(handler)

    return () => {
      const list = this.listeners.get(event) || []
      this.listeners.set(
        event,
        list.filter((h) => h !== handler)
      )
    }
  }
}

export const gameBridge = new GameBridge()
