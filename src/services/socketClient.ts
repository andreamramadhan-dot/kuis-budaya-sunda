/**
 * socketClient.ts – Jembatan WebSocket ke Server Multiplayer (Divisi 6)
 * Saat ini berupa stub siap pakai; implementasi WebSocket oleh Divisi 6.
 */

type SocketEventName =
  | 'ROOM_JOIN'
  | 'ANSWER_SUBMIT'
  | 'SCORE_BROADCAST'
  | 'GATE_CLOSED'
  | 'CLAIM_SAWAH'
  | 'TUG_OF_WAR_TICK'
  | 'SESSION_START'
  | 'SESSION_PAUSE'
  | 'SESSION_END'

type SocketHandler = (data: Record<string, unknown>) => void

const eventHandlers: Partial<Record<SocketEventName, SocketHandler[]>> = {}

export const socketClient = {
  /** Emit event ke server (akan diganti implementasi WebSocket nyata oleh Divisi 6) */
  emit(event: SocketEventName, data: Record<string, unknown> = {}): void {
    console.debug('[socketClient] emit:', event, data)
    // TODO: ws.send(JSON.stringify({ event, data }))
  },

  /** Subscribe ke event dari server */
  on(event: SocketEventName, handler: SocketHandler): () => void {
    if (!eventHandlers[event]) eventHandlers[event] = []
    eventHandlers[event]!.push(handler)
    // Return cleanup function
    return () => {
      if (eventHandlers[event]) {
        eventHandlers[event] = eventHandlers[event]!.filter(h => h !== handler)
      }
    }
  },

  /** Simulasi menerima event (untuk dev mode & testing) */
  simulateReceive(event: SocketEventName, data: Record<string, unknown> = {}): void {
    eventHandlers[event]?.forEach(h => h(data))
  },
}
