/**
 * Node configuration
 *
 * Nodes are configured via the NODES environment variable (JSON format):
 *   NODES='{"Node 1":"http://host:port","Node 2":"http://host:port"}'
 *
 * If NODES is not set, no nodes will be available.
 */

function loadNodes(): Record<string, string> {
  const nodesEnv = process.env.NODES;
  if (!nodesEnv) return {};

  try {
    const parsed = JSON.parse(nodesEnv) as Record<string, string>;
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    console.warn('NODES env var is invalid, no nodes configured');
    return {};
  } catch (error) {
    console.error('Failed to parse NODES env var:', error);
    return {};
  }
}

export const nodes = loadNodes();
