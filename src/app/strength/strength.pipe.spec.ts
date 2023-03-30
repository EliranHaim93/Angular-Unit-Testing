import { StrengthPipe } from "./strength.pipe";

describe("StrengthPipe", () => {
  it("should display weak if strength is 5", () => {
    //arrange
    let pipe = new StrengthPipe();

    //act
    let val = pipe.transform(5);

    //assert
    expect(val).toEqual("5 (weak)");

    //if the act is very small can also be:
    //expect(pipe.transform(5)).toEqual("5 (weak")
  });

  //another scenario to test:
  it("should display strong if stength is 10", () => {
    let pipe = new StrengthPipe();

    expect(pipe.transform(10)).toEqual("10 (strong)");
  });
});

//** A good test will test all the scnarios in the file */
