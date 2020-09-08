import Batch from "../models/Batch";

export function seedTestBatch(): Promise<Batch | undefined> {
  return Batch.count().then((count) => {
    if (count === 0) {
      console.log("Seeding db with test Batch...")
      const batch = new Batch();
      batch.name = "TEST Batch";
      batch.description = "This is a test batch for collecting events.";
      return batch.save();
    }
  });
}
