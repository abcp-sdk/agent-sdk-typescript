// Agent typed client SDK for TypeScript (agent.v1.AgentService).
//
// Per the connectrpc convention this package ships ONLY the generated RPC
// client (AgentService + message types) plus transport-interceptor primitives:
//   - `bearerInterceptor(token)`  → attaches `Authorization: Bearer <token>`
//   - `withHeaders(headers)`      → attaches arbitrary per-request headers
//
// The caller builds its own `Transport` (connect-web for browsers, connect-node
// for servers) and hands it to `createClient(AgentService, transport)`. Nothing
// here constructs a transport for you.
import { type Transport, type Interceptor } from '@connectrpc/connect'

import { AgentService } from './gen/agent/v1/agent_pb.js'

export { AgentService }
export * from './gen/agent/v1/agent_pb.js'

export type { Transport, Interceptor }

/** Build a bearer-auth interceptor: `Authorization: Bearer <token>`. */
export function bearerInterceptor(token: string): Interceptor {
  return next => async req => {
    if (token) req.header.set('Authorization', `Bearer ${token}`)
    return await next(req)
  }
}

/** Build an interceptor that attaches arbitrary headers to every request. */
export function withHeaders(headers: Record<string, string>): Interceptor {
  return next => async req => {
    for (const [k, v] of Object.entries(headers)) req.header.set(k, v)
    return await next(req)
  }
}
