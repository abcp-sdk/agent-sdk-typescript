// Agent typed client SDK for TypeScript (agent.v1.AgentService).
//
// Default export is the WEB transport (fetch / @connectrpc/connect-web) —
// the right choice for browsers / SPA frontends. For Node (h2/h2c via
// @connectrpc/connect-node), import from './node.js' explicitly:
//
//   import { createAgentNodeClient } from '@abcp/agent-sdk/node'
import { AgentService } from './gen/agent/v1/agent_pb.js'

export { AgentService }
export * from './gen/agent/v1/agent_pb.js'
export {
  createAgentWebClient,
  type AgentWebClient,
  type AgentWebOptions,
} from './web.js'
