import type {
  Destination,
  IndoorNode,
  NavigationEdge,
  QRLocation,
  RouteResult,
  TurnAction,
  TurnStep,
} from "./wayfindr-types";
import { DEMO_DESTINATIONS, DEMO_EDGES, DEMO_NODES, DEMO_QR_LOCATIONS } from "./wayfindr-data";

export function getQRContext(locationKey?: string | null): QRLocation {
  const cleanKey = locationKey ? locationKey.toLowerCase().trim() : "main-gate";
  return DEMO_QR_LOCATIONS[cleanKey] ?? DEMO_QR_LOCATIONS["main-gate"];
}

export function searchDestinations(query: string, list: Destination[] = DEMO_DESTINATIONS): Destination[] {
  const q = query.toLowerCase().trim();
  if (!q) return list;

  return list.filter((dest) => {
    const haystack = [
      dest.name,
      dest.category,
      dest.buildingName,
      dest.floorName,
      dest.roomNumber,
      dest.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function calculateWayfindrRoute(
  startNodeId: string,
  targetDestinationId: string
): RouteResult | null {
  const targetDest = DEMO_DESTINATIONS.find((d) => d.id === targetDestinationId);
  const targetNodeId = targetDest?.nodeId ?? targetDestinationId;

  if (startNodeId === targetNodeId) {
    const startNode = DEMO_NODES.find((n) => n.id === startNodeId);
    return {
      nodes: [startNodeId],
      edges: [],
      totalMetres: 0,
      estimatedMinutes: 0,
      totalDistance: 0,
      steps: [
        {
          stepNumber: 1,
          text: `You are already at ${targetDest?.name ?? startNode?.name ?? "this location"}.`,
          action: "arrive",
          fromNodeId: startNodeId,
          toNodeId: startNodeId,
          fromName: startNode?.name ?? "Start",
          toName: targetDest?.name ?? "Destination",
          metres: 0,
          remainingMetres: 0,
        },
      ],
    };
  }

  // Build Adjacency Graph
  const adjacency = new Map<string, NavigationEdge[]>();
  for (const edge of DEMO_EDGES) {
    const forward = { ...edge };
    const reverse = { from: edge.to, to: edge.from, distance: edge.distance, edgeType: edge.edgeType };
    adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), forward]);
    adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), reverse]);
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set<string>();

  for (const node of DEMO_NODES) {
    distances.set(node.id, Infinity);
    unvisited.add(node.id);
  }
  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity)
    )[0];

    if (!current || (distances.get(current) ?? Infinity) === Infinity) break;
    if (current === targetNodeId) break;
    unvisited.delete(current);

    for (const edge of adjacency.get(current) ?? []) {
      const nextDistance = (distances.get(current) ?? 0) + edge.distance;
      if (nextDistance < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, nextDistance);
        previous.set(edge.to, current);
      }
    }
  }

  const pathNodes: string[] = [targetNodeId];
  while (pathNodes[0] !== startNodeId && previous.has(pathNodes[0])) {
    pathNodes.unshift(previous.get(pathNodes[0])!);
  }

  if (pathNodes[0] !== startNodeId) return null;

  const edges: NavigationEdge[] = pathNodes.slice(0, -1).map((from, idx) => {
    const to = pathNodes[idx + 1];
    const found = DEMO_EDGES.find(
      (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    return found
      ? { ...found, from, to }
      : {
          from,
          to,
          distance: 15,
          edgeType: "walk",
        };
  });

  const totalMetres = edges.reduce((sum, e) => sum + e.distance, 0);
  const estimatedMinutes = Math.max(1, Math.ceil(totalMetres / 60));

  // Generate Turn Steps
  const nodeMap = new Map(DEMO_NODES.map((n) => [n.id, n]));
  const steps: TurnStep[] = edges.map((edge, index) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    const fromName = fromNode?.name ?? edge.from;
    const toName = toNode?.name ?? edge.to;
    const isLast = index === edges.length - 1;

    const traveledSoFar = edges.slice(0, index).reduce((acc, e) => acc + e.distance, 0);
    const remainingMetres = totalMetres - traveledSoFar;

    let action: TurnAction = "straight";
    let text = "";

    if (edge.edgeType === "stairs") {
      action = "stairs";
      text = `Take the staircase from ${fromName} to ${toName} (${edge.distance} m).`;
    } else if (edge.edgeType === "elevator") {
      action = "elevator";
      text = `Take the elevator from ${fromName} to ${toName} (${edge.distance} m).`;
    } else {
      if (index === 0) {
        text = `Start at ${fromName}, walk toward ${toName} (${edge.distance} m).`;
      } else {
        text = `Continue to ${toName} (${edge.distance} m).`;
      }
    }

    if (isLast) {
      text += ` Destination is ahead.`;
    }

    return {
      stepNumber: index + 1,
      text,
      action: isLast && edges.length === 1 ? "arrive" : action,
      fromNodeId: edge.from,
      toNodeId: edge.to,
      fromName,
      toName,
      metres: edge.distance,
      remainingMetres,
      floorTransition:
        fromNode?.floorId !== toNode?.floorId
          ? {
              fromFloor: fromNode?.floorId ?? "G",
              toFloor: toNode?.floorId ?? "G",
              type: edge.edgeType === "elevator" ? "elevator" : "stairs",
            }
          : undefined,
    };
  });

  return {
    nodes: pathNodes,
    edges,
    totalMetres,
    totalDistance: totalMetres,
    estimatedMinutes,
    steps,
  };
}

export function findShortestPath(
  startNodeId: string,
  targetNodeId: string,
  _nodes?: IndoorNode[],
  _edges?: NavigationEdge[]
): RouteResult | null {
  return calculateWayfindrRoute(startNodeId, targetNodeId);
}

export function generateTurnSteps(
  routeResult: RouteResult,
  _nodes?: IndoorNode[],
  _destName?: string
): TurnStep[] {
  return routeResult.steps ?? [];
}
