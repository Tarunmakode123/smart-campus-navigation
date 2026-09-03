import type { Location } from "@/lib/locations";

export const DEFAULT_ENTRY_ID = "main-gate";

export type EdgeType = "walk" | "stairs" | "lift";

export type RouteEdge = {
  from: string;
  to: string;
  metres: number;
  edgeType?: EdgeType;
};

export type RouteResult = {
  nodes: string[];
  edges: RouteEdge[];
  totalMetres: number;
};

export const HOME_ROUTE_EDGES: RouteEdge[] = [
  { from: "main-gate", to: "hall", metres: 7 },
  { from: "hall", to: "first-bedroom", metres: 0.5 },
  { from: "hall", to: "dining-room", metres: 0.5 },
  { from: "hall", to: "kitchen", metres: 4 },
  { from: "dining-room", to: "kitchen", metres: 1.5 },
  { from: "hall", to: "bathroom", metres: 2 },
  { from: "hall", to: "second-bedroom", metres: 3 },
  { from: "second-bedroom", to: "bhagwan-room", metres: 3 },
  { from: "kitchen", to: "porch", metres: 0.5 },
];

export function calculateHomeRoute(startId: string, destinationId: string): RouteResult {
  if (startId === destinationId) {
    return { nodes: [startId], edges: [], totalMetres: 0 };
  }

  const adjacency = new Map<string, RouteEdge[]>();
  for (const edge of HOME_ROUTE_EDGES) {
    const edgeType = edge.edgeType ?? "walk";
    const forward = { ...edge, edgeType };
    const reverse = { from: edge.to, to: edge.from, metres: edge.metres, edgeType };
    adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), forward]);
    adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), reverse]);
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set(adjacency.keys());
  distances.set(startId, 0);
  unvisited.add(startId);
  unvisited.add(destinationId);

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity),
    )[0];
    if (!current || (distances.get(current) ?? Infinity) === Infinity) break;
    if (current === destinationId) break;
    unvisited.delete(current);

    for (const edge of adjacency.get(current) ?? []) {
      const nextDistance = (distances.get(current) ?? 0) + edge.metres;
      if (nextDistance < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, nextDistance);
        previous.set(edge.to, current);
        unvisited.add(edge.to);
      }
    }
  }

  const nodes = [destinationId];
  while (nodes[0] !== startId && previous.has(nodes[0])) {
    nodes.unshift(previous.get(nodes[0])!);
  }

  if (nodes[0] !== startId) {
    return { nodes: [startId, destinationId], edges: [], totalMetres: 0 };
  }

  const edges = nodes.slice(0, -1).map((from, index) => {
    const to = nodes[index + 1];
    const found = HOME_ROUTE_EDGES.find(
      (edge) =>
        (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
    );
    return found
      ? { from, to, metres: found.metres, edgeType: found.edgeType ?? "walk" }
      : { from, to, metres: 0, edgeType: "walk" as const };
  });

  return {
    nodes,
    edges,
    totalMetres: Number(edges.reduce((sum, edge) => sum + edge.metres, 0).toFixed(1)),
  };
}

export type TurnAction = "straight" | "turn-right" | "turn-left" | "stairs" | "lift" | "arrive";

export type DetailedStep = {
  text: string;
  action: TurnAction;
  fromName: string;
  toName: string;
  metres: number;
  remainingMetres: number;
  progressPercent: number;
};

export function buildDetailedRouteSteps(route: RouteResult, locations: Location[]): DetailedStep[] {
  const byId = new Map(locations.map((loc) => [loc.id, loc]));

  if (route.nodes.length === 1) {
    const locName = byId.get(route.nodes[0])?.name ?? route.nodes[0];
    return [
      {
        text: `You are already at ${locName}.`,
        action: "arrive",
        fromName: locName,
        toName: locName,
        metres: 0,
        remainingMetres: 0,
        progressPercent: 100,
      },
    ];
  }

  // Calculate cumulative remaining distances
  const total = route.totalMetres || 1;

  return route.edges.map((edge, index) => {
    const fromLoc = byId.get(route.nodes[index]);
    const toLoc = byId.get(route.nodes[index + 1]);
    const fromName = fromLoc?.name ?? route.nodes[index];
    const toName = toLoc?.name ?? route.nodes[index + 1];
    const distance = formatMetres(edge.metres);
    const type = edge.edgeType ?? "walk";

    // Compute remaining distance from this step to final destination
    const traveledSoFar = route.edges.slice(0, index).reduce((acc, e) => acc + e.metres, 0);
    const remainingMetres = Number((total - traveledSoFar).toFixed(1));
    const progressPercent = Math.round((traveledSoFar / total) * 100);

    let action: TurnAction = "straight";
    let text = "";

    if (type === "stairs") {
      action = "stairs";
      text = `Take the stairs from ${fromName} to ${toName} (${distance}).`;
    } else if (type === "lift") {
      action = "lift";
      text = `Take the lift from ${fromName} to ${toName} (${distance}).`;
    } else {
      // Determine direction by checking relative map coordinate vectors if available
      if (fromLoc?.mapX != null && fromLoc?.mapY != null && toLoc?.mapX != null && toLoc?.mapY != null) {
        const dx = toLoc.mapX - fromLoc.mapX;
        if (dx > 25) {
          action = "turn-right";
          text = index === 0
            ? `Start from ${fromName}, turn right and move ${distance} to ${toName}.`
            : `Turn right from ${fromName} and move ${distance} to ${toName}.`;
        } else if (dx < -15) {
          action = "turn-left";
          text = index === 0
            ? `Start from ${fromName}, turn left and move ${distance} to ${toName}.`
            : `Turn left from ${fromName} and move ${distance} to ${toName}.`;
        } else {
          action = "straight";
          text = index === 0
            ? `Start from ${fromName}, move straight ${distance} to ${toName}.`
            : `Continue straight ${distance} from ${fromName} to ${toName}.`;
        }
      } else {
        action = index === 0 ? "straight" : index % 2 === 1 ? "turn-right" : "turn-left";
        text = index === 0
          ? `Start from ${fromName}, move ${distance} to ${toName}.`
          : `Move ${distance} from ${fromName} to ${toName}.`;
      }
    }

    return {
      text,
      action,
      fromName,
      toName,
      metres: edge.metres,
      remainingMetres,
      progressPercent,
    };
  });
}

export function buildRouteSteps(route: RouteResult, locations: Location[]) {
  return buildDetailedRouteSteps(route, locations).map((s) => s.text);
}

export function formatMetres(value: number) {
  return Number.isInteger(value) ? `${value} m` : `${value.toFixed(1)} m`;
}
