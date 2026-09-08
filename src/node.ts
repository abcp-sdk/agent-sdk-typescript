// Agent typed client SDK for TypeScript (agent.v1.AgentService).
//
// Node transport (`@connectrpc/connect-node`): handles HTTP/2 only. For
// `http://` it uses cleartext HTTP/2 (h2c prior knowledge); for `https://` it
// negotiates ALPN `h2`. Use for servers / ext servers / in-cluster clients.
import { createClient, type Transport } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-node'

import { AgentService } from './gen/agent/v1/agent_pb.js'

export { AgentService }
export * from './gen/agent/v1/agent_pb.js'

export interface AgentNodeOptions {
  /** Agent base URL (protocol + host, no trailing slash needed). */
  baseUrl: string
  /** Optional bearer token attached to every request. */
  token?: string
  /** Custom headers attached to every request. */
  headers?: Record<string, string>
  /** Transport override (tests). */
  transport?: Transport
}

export function createAgentNodeClient(options: AgentNodeOptions) {
  const headers: Record<string, string> = { ...(options.headers ?? {}) }
  if (options.token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${options.token}`
  }
  const transport =
    options.transport ??
    createConnectTransport({
      baseUrl: options.baseUrl.replace(/\/+$/, ''),
      httpVersion: '2',
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

export type AgentNodeClient = ReturnType<typeof createAgentNodeClient>
