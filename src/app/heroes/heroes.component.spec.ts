//**isolated test example */
import { of } from "rxjs/internal/observable/of";
import { HeroesComponent } from "./heroes.component";

describe("HeroesComponent", () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "SpiderDude", strength: 8 },
      { id: 2, name: "Wonderful Woman", strength: 24 },
      { id: 3, name: "SuperDude", strength: 55 },
    ];

    /** a spy obj lets us create a mock object that we can controll
    what methods and what they return
    can ask it what methods were called in a test
    */
    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHeroes",
      "deleteHero",
    ]);

    component = new HeroesComponent(mockHeroService);
  });

  //state based test => check if the state has changed
  describe("delete", () => {
    it("should remove the indicated hero from the heroes list", () => {
      //if there is subscription, the data is returned as an observable to use the data we need to manually return it as an observable.
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    });
  });

  //interaction based test => check if an interaction has been made between the class tested and a colaborator class
  it("should call deleteHero", () => {
    mockHeroService.deleteHero.and.returnValue(of(true));
    component.heroes = HEROES;

    component.delete(HEROES[2]);

    //**this tests the secont line in the delete method that triggers the deleteHero method inside of the service => the test is to check if the service's delete method is invoked*/
    expect(mockHeroService.deleteHero).toHaveBeenCalled();
  });

  it("should call deleteHero with HEROES[2]", () => {
    mockHeroService.deleteHero.and.returnValue(of(null));
    component.heroes = HEROES;

    component.delete(HEROES[2]);

    //**check if the method is invoked with the correct param. */
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
  });
});
