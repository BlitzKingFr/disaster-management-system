


export interface IncidentType {
    _id: string;
    severity: number;
    createdAt: Date | string;
    urgencyScore?: number;
    [key: string]: any;
}

/**
 * ALGORITHM: MERGE SORT (Divide & Conquer)
 * Purpose: Sorts incidents based on Urgency Score in O(n log n) time.
 * This is a requirement for the "Critical Incident Prioritization" feature.
 */
export function mergeSortIncidents(arr: IncidentType[]): IncidentType[] {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(
        mergeSortIncidents(left),
        mergeSortIncidents(right)
    );
}

function merge(left: IncidentType[], right: IncidentType[]): IncidentType[] {
    let resultArray: IncidentType[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        // We want HIGHER urgency score first (Descending order)
        const leftScore = left[leftIndex].urgencyScore || 0;
        const rightScore = right[rightIndex].urgencyScore || 0;

        if (leftScore >= rightScore) {
            resultArray.push(left[leftIndex]);
            leftIndex++;
        } else {
            resultArray.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

/**
 * Calculates the Urgency Score for an incident.
 * Formula: (Severity * 10) + (Report Count * 2) + (Hours Since Creation)
 */
export function calculateUrgencyScore(severity: number, reportCount: number = 1, createdAt: Date): number {
    const hoursElapsed = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    // Severity is 1-5. Max severity (5) * 10 = 50.
    // Each additional report adds urgency.
    // Older incidents might get higher priority to prevent neglect, OR lower if we prioritize fresh disasters.
    // Let's assume standard triage: High Severity First.
    return (severity * 10) + (reportCount * 2);
}
