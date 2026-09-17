import { DEMO_DESTINATIONS, DEMO_EDGES, DEMO_NODES } from "@/lib/wayfindr-data";
import { findShortestPath, generateTurnSteps } from "@/lib/wayfindr-engine";
import type { Destination, NavigationPosition, RouteResult, TurnStep } from "@/lib/wayfindr-types";

export function calculateRouteFromPosition(
  currentPos: NavigationPosition,
  targetDestination: Destination
): RouteResult | null {
  const startNodeId = currentPos.nodeId || DEMO_NODES[0].id;
  return findShortestPath(startNodeId, targetDestination.nodeId, DEMO_NODES, DEMO_EDGES);
}

export function calculateRemainingRouteDistance(
  currentPos: NavigationPosition,
  routeResult: RouteResult
): number {
  if (!routeResult || routeResult.nodes.length === 0) return 0;

  // Find index of node matching current position, or calculate remaining distance from current node
  const currNodeId = currentPos.nodeId;
  const nodeIndex = currNodeId ? routeResult.nodes.indexOf(currNodeId) : 0;

  if (nodeIndex === -1) {
    // Current node off path -> return total route distance
    return routeResult.totalMetres;
  }

  // Sum distances of edges from current node index to end of path
  const remainingEdges = routeResult.edges.slice(nodeIndex);
  return remainingEdges.reduce((sum, e) => sum + e.distance, 0);
}

export function calculateETA(remainingMetres: number, speedMps = 1.3): number {
  if (remainingMetres <= 0) return 0;
  const seconds = remainingMetres / speedMps;
  return Math.max(1, Math.ceil(seconds / 60));
}

export function checkRouteDeviation(
  currentPos: NavigationPosition,
  routeResult: RouteResult,
  thresholdMetres = 12
): boolean {
  if (!currentPos.nodeId || !routeResult || routeResult.nodes.length === 0) return false;
  // If current node is not in the active route nodes path
  return !routeResult.nodes.includes(currentPos.nodeId);
}

export function checkArrival(remainingMetres: number, thresholdMetres = 8): boolean {
  return remainingMetres <= thresholdMetres;
}
