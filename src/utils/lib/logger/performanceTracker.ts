export class PerformanceTracker {
	private static markers: Map<string, number> = new Map();
	private static startTime: number = Date.now();

	static start(marker: string): void {
		this.markers.set(marker, Date.now());
	}

	static end(marker: string): number {
		const startTime = this.markers.get(marker);
		if (!startTime) {
			return 0;
		}

		const duration = Date.now() - startTime;
		this.markers.delete(marker);
		return duration;
	}

	static getElapsedTime(): number {
		return Date.now() - this.startTime;
	}

	static formatElapsedTime(): string {
		const elapsed = this.getElapsedTime();
		return `+${elapsed}ms`;
	}

	static reset(): void {
		this.markers.clear();
		this.startTime = Date.now();
	}

	static getMarkers(): string[] {
		return Array.from(this.markers.keys());
	}
}
