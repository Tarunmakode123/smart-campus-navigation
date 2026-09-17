import { DEMO_DESTINATIONS, DEMO_PEOPLE } from "@/lib/wayfindr-data";
import type { AutocompleteItem, Destination, Person } from "@/lib/wayfindr-types";

export function normalizeSearchText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

export function searchDestinations(query: string): AutocompleteItem[] {
  const q = normalizeSearchText(query);
  if (!q) return [];

  const items: { item: AutocompleteItem; score: number }[] = [];

  for (const dest of DEMO_DESTINATIONS) {
    const nameNorm = normalizeSearchText(dest.name);
    const catNorm = normalizeSearchText(dest.category);
    const roomNorm = dest.roomNumber ? normalizeSearchText(dest.roomNumber) : "";
    const descNorm = dest.description ? normalizeSearchText(dest.description) : "";

    let score = 0;

    if (nameNorm.startsWith(q)) {
      score = 100 - nameNorm.length;
    } else if (catNorm.startsWith(q) || roomNorm.startsWith(q)) {
      score = 80;
    } else if (nameNorm.includes(q)) {
      score = 60;
    } else if (catNorm.includes(q) || roomNorm.includes(q) || descNorm.includes(q)) {
      score = 40;
    }

    if (score > 0) {
      items.push({
        item: {
          id: dest.id,
          title: dest.name,
          subtitle: `${dest.floorName} • ${dest.buildingName}${dest.roomNumber ? ` (${dest.roomNumber})` : ""}`,
          type: "destination",
          originalObj: dest,
        },
        score,
      });
    }
  }

  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map((entry) => entry.item);
}

export function searchPeople(query: string): AutocompleteItem[] {
  const q = normalizeSearchText(query);
  if (!q) return [];

  const items: { item: AutocompleteItem; score: number }[] = [];

  for (const person of DEMO_PEOPLE) {
    const nameNorm = normalizeSearchText(person.name);
    const titleNorm = normalizeSearchText(person.title);
    const deptNorm = normalizeSearchText(person.department);
    const roomNorm = normalizeSearchText(person.roomNumber);

    let score = 0;

    if (nameNorm.startsWith(q)) {
      score = 100 - nameNorm.length;
    } else if (titleNorm.startsWith(q) || deptNorm.startsWith(q)) {
      score = 80;
    } else if (nameNorm.includes(q)) {
      score = 60;
    } else if (titleNorm.includes(q) || deptNorm.includes(q) || roomNorm.includes(q)) {
      score = 40;
    }

    if (score > 0) {
      items.push({
        item: {
          id: person.id,
          title: person.name,
          subtitle: `${person.title} • ${person.roomNumber} (${person.floorName})`,
          type: "person",
          originalObj: person,
        },
        score,
      });
    }
  }

  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map((entry) => entry.item);
}

export function findDestinationById(id: string): Destination | null {
  return DEMO_DESTINATIONS.find((d) => d.id === id) || null;
}

export function findPersonById(id: string): Person | null {
  return DEMO_PEOPLE.find((p) => p.id === id) || null;
}
