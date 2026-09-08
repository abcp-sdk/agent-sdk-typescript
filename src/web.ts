// Agent typed client SDK for TypeScript (agent.v1.AgentService).
//
// Web transport (fetch-based, `@connectrpc/connect-web`): browser-friendly,
// follows CORS + same-origin. Use for browsers / SPA frontends.
import { createClient, type Transport } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'

import { AgentService } from './gen/agent/v1/agent_pb.js'

export { AgentService }
export * from './gen/agent/v1/agent_pb.js'

export interface AgentWebOptions {
  /** Gateway/agent base URL (protocol + host, no trailing slash needed). */
  baseUrl: string
  /** Optional bearer token attached to every request. */
  token?: string
  /** Custom headers attached to every request. */
  headers?: Record<string, string>
  /** Transport override (tests). */
  transport?: Transport
}

export function createAgentWebClient(options: AgentWebOptions) {
  const headers: Record<string, string> = { ...(options.headers ?? {}) }
  if (options.token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${options.token}`
  }
  const transport =
    options.transport ??
    createConnectTransport({
      baseUrl: options.baseUrl.replace(/\/+$/, ''),
      interceptors: [
        next => async req => {
          for (const [k, v] of Object.entries(headers)) {
            req.header.set(k, v)
          }
          return await next(req)
        },
      ],
    })
  return createClient(AgentService, transport)
}

export type AgentWebClient = ReturnType<typeof createAgentWebClient>
