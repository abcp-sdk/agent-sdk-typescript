// Agent typed client SDK for TypeScript (agent.v1.AgentService).
//
// This package ships ONLY the buf-generated RPC client (`AgentService`) and
// message types. Nothing hand-written, no transport: the caller builds its own
// `Transport` (connect-web / connect-node) and passes it to
// `createClient(AgentService, transport)`.
export * from './gen/agent/v1/agent_pb.js'
