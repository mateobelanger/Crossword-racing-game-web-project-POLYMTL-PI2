export class Helper {
    public static shuffle<T>(array: T[]): T[] {
        for (let i: number = array.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    public static arrayToSet<T>(array: T[]): Set<T> {
        const result: Set<T> = new Set<T>();
        array.forEach((element: T) => {
            result.add(element);
        });

        return result;
    }
}
