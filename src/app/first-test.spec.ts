describe("my first test", () => {
  let sut; // system under test

  //move less interesting setup into here
  beforeEach(() => {
    sut = {};
  }); // reset the system before every test

  //this is the test ==>>
  it("should be true if true", () => {
    //the it function should contain the the critical setup

    //arrange
    sut.a = false;

    //act
    sut.a = true;

    //assert
    expect(sut.a).toBe(true);
  });
});
