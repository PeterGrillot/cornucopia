/* Warmup 1 */
function mostFrequent(input: string): string {
  const inputArray = input.split("");
  const map = new Map<string, number>();
  inputArray.forEach((i) => {
    map.set(i, (map.get(i) ?? 0) + 1);
  });

  // Sort and such
  let topChar = "";
  let topCount = 0;
  map.forEach((count, char) => {
    if (count > topCount) {
      topCount = count;
      topChar = char;
    }
  });

  return topChar;
}
// console.log(mostFrequent("aabbcca")); // → "a"
// console.log(mostFrequent("abcbabac")); // → "b" (tie, but 'b' hit 2 first)
// console.log(mostFrequent("zzbbz")); // → "z"

/* Warmup 2 */
type ApiResponse = {
  data: {
    user: {
      id: string;
      name: string;
      role: "admin" | "viewer" | "editor";
      preferences?: {
        theme: "light" | "dark";
        notifications: boolean;
      };
    };
  };
  status: number;
  error?: string;
};

type UserPreference = Required<ApiResponse["data"]["user"]>["preferences"];

/* Warmup 3 */
type Entry = {
  userId: string;
  date: string;
  hours: number;
};
type Entries = Entry[];

type Summary = {
  userId: string;
  totalHours: number;
  dailyAverage: number;
  daysWorked: number;
}[];

const entries = [
  { userId: "u1", date: "2024-01-01", hours: 3 },
  { userId: "u2", date: "2024-01-01", hours: 5 },
  { userId: "u1", date: "2024-01-01", hours: 2 },
  { userId: "u1", date: "2024-01-02", hours: 8 },
  { userId: "u2", date: "2024-01-02", hours: 4 },
  { userId: "u1", date: "2024-01-03", hours: 6 },
];

function summarizeEntries(entries: Entries): Summary {
  const summary = new Map<
    string,
    {
      hours: number;
      days: number;
    }
  >();
  entries.forEach((entry) => {
    if (summary.has(entry.userId)) {
      summary.set(entry.userId, {
        hours: Number(summary.get(entry.userId)!.hours) + entry.hours,
        days: Number(summary.get(entry.userId)!.days) + 1,
      });
    } else {
      summary.set(entry.userId, { hours: entry.hours, days: 1 });
    }
  });
  // convert and do maths
  const result: Summary = [];
  summary.forEach((v, k) => {
    result.push({
      userId: k,
      totalHours: v.hours,
      dailyAverage: v.hours / v.days,
      daysWorked: v.days,
    });
  });
  return result.sort((a, b) => b.totalHours - a.totalHours);
}
// console.log(summarizeEntries(entries));

/* Problem 1 */
function groupNumbers(arr: number[]): Record<string, number[]> {
  const even: number[] = [];
  const odd: number[] = [];
  arr.map((i) => {
    if (i % 2 === 0) {
      even.push(i);
    } else {
      odd.push(i);
    }
  });
  return { even, odd };
}
console.log(groupNumbers([1, 2, 3, 4, 5, 6]));
// → { even: [2, 4, 6], odd: [1, 3, 5] }

console.log(groupNumbers([7, 7, 2]));
// → { even: [2], odd: [7, 7] }

/* Problem 2 */
function longestUniqueSubstring(input: string): string {
  let uniqueString = "";
  const arrayInput = input.split("");
  arrayInput.map((i, index) => {
    if (arrayInput[index + 1] && i !== arrayInput[index + 1]) {
      uniqueString = `${uniqueString}${i}`;
    } else {
      console.log(i); // Not sure what to do here
    }
  });

  return uniqueString;
}
console.log(longestUniqueSubstring("abcabcbb")); // → "abc"
console.log(longestUniqueSubstring("bbbbb")); // → "b"
console.log(longestUniqueSubstring("pwwkew")); // → "wke"
console.log(longestUniqueSubstring("")); // → ""

/* Problem 3 */
const severityWeight = { critical: 5, high: 3, medium: 2, low: 1 };
type Severity = keyof typeof severityWeight;
type EventItem = { assetId: string; severity: Severity; timestamp: number };
type Events = EventItem[];

type Risk = {
  assetId: string;
  highestSeverity: string;
  eventCount: number;
  riskScore: number;
};
type RiskReport = Risk[];

const eventsInput: Events = [
  { assetId: "a1", severity: "critical", timestamp: 1700000000 },
  { assetId: "a2", severity: "high", timestamp: 1700000100 },
  { assetId: "a1", severity: "medium", timestamp: 1700000200 },
  { assetId: "a1", severity: "critical", timestamp: 1700000300 },
  { assetId: "a3", severity: "low", timestamp: 1700000400 },
  { assetId: "a2", severity: "medium", timestamp: 1700000500 },
  { assetId: "a2", severity: "high", timestamp: 1700000600 },
];

function getRiskReport(events: Events): RiskReport {
  const eventMap = new Map<
    string,
    {
      highestSeverity: Severity;
      eventCount: Set<number>; // uniq
      riskScore: number;
    }
  >();
  events.forEach((event) => {
    if (eventMap.has(event.assetId)) {
      const existing = eventMap.get(event.assetId)!;
      const severityIndex = severityWeight[event.severity];
      if (severityIndex > severityWeight[existing.highestSeverity]) {
        existing.highestSeverity = event.severity;
      }
      existing.eventCount.add(event.timestamp);
      existing.riskScore = (existing.riskScore ?? 0) + Number(severityIndex);
    } else {
      eventMap.set(event.assetId, {
        highestSeverity: event.severity,
        eventCount: new Set([]),
        riskScore: severityWeight[event.severity],
      });
    }
  });

  const result: RiskReport = [];
  eventMap.forEach((v, k) => {
    result.push({
      assetId: k,
      highestSeverity: v.highestSeverity,
      eventCount: v.eventCount.size,
      riskScore: v.riskScore,
    });
  });
  return result;
}
console.log(getRiskReport(eventsInput));
