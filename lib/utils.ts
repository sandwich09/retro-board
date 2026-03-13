// Pastel colors for sticky notes
const PASTEL_COLORS = [
  "#fef08a", // yellow
  "#bbf7d0", // green
  "#bfdbfe", // blue
  "#fecaca", // red
  "#e9d5ff", // purple
  "#fed7aa", // orange
  "#a5f3fc", // cyan
  "#fbcfe8", // pink
];

export function randomPastelColor(): string {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
}

// Random color for user presence indicator
const USER_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

export function randomUserColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

// Generate a random display name
const ADJECTIVES = ["Swift", "Bold", "Calm", "Wise", "Keen", "Bright", "Cool", "Smart"];
const NOUNS = ["Falcon", "Panda", "Tiger", "Eagle", "Koala", "Lynx", "Otter", "Crane"];

export function randomUserName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}
