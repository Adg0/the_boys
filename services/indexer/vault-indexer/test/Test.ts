import assert from "assert";
import { 
  TestHelpers,
  SVC_StrLog
} from "generated";
const { MockDb, SVC } = TestHelpers;

describe("SVC contract StrLog event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for SVC contract StrLog event
  const event = SVC.StrLog.mock({data: {} /* It mocks event fields with default values, so you only need to provide data */});

  it("SVC_StrLog is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await SVC.StrLog.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualSVCStrLog = mockDbUpdated.entities.SVC_StrLog.get(
      `${event.chainId}_${event.block.height}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedSVCStrLog: SVC_StrLog = {
      id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualSVCStrLog, expectedSVCStrLog, "Actual SVCStrLog should be the same as the expectedSVCStrLog");
  });
});
