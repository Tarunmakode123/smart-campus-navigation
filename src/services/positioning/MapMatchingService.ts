import { DEMO_EDGES, DEMO_NODES } from "@/lib/wayfindr-data";
import type { IndoorNode, NavigationPosition } from "@/lib/wayfindr-types";

export function snapToWalkableNode(
  rawPos: { x: number; y: number; floorId: string }
): IndoorNode {
  const floorNodes = DEMO_NODES.filter((n) => n.floorId === rawPos.floorId);
  if (floorNodes.length === 0) return DEMO_NODES[0];

  let minDistanceSq = Infinity;
  let closestNode = floorNodes[0];

  for (const node of floorNodes) {
    const dx = node.x - rawPos.x;
    const dy = node.y - rawPos.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestNode = node;
    }
  }

  return closestNode;
}

export function matchPositionToGraph(
  rawPos: NavigationPosition
): NavigationPosition {
  const matchedNode = snapToWalkableNode({
    x: rawPos.x,
    y: rawPos.y,
    floorId: rawPos.floorId,
  });

  return {
    ...rawPos,
    x: matchedNode.x,
    y: matchedNode.y,
    nodeId: matchedNode.id,
    floorId: matchedNode.floorId,
    source: rawPos.source === "GPS" ? "MAP_MATCHED" : rawPos.source,
  };
}
