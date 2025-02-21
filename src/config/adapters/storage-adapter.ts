export class StorageAdapter {
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? (JSON.parse(storedValue) as T) : null;
    } catch {
      return null;
    }
  }

  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(error);
      throw new Error(`Error setting item ${key}`);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
      throw new Error(`Error removing item ${key}`);
    }
  }

  static async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(error);
      throw new Error("Error clearing storage");
    }
  }
}
