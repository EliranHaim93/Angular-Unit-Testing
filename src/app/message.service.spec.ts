//isolated test for as service with no dependencies
import { MessageService } from "./message.service";

describe("MessageService", () => {
  let service: MessageService;

  //makes sure we have a fresh unmodified service before each test
  beforeEach(() => {
    service = new MessageService();
  });

  it("should have no messages to start", () => {
    expect(service.messages.length).toBe(0);
  });

  it("should add a message when add is called", () => {
    service.add("message1");

    expect(service.messages.length).toBe(1);
  });

  it("should remove all messages when clear is called", () => {
    service.add("message1");

    service.clear();

    expect(service.messages.length).toBe(0);
  });
});
