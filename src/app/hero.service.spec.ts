import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

//** service integraton tests with HTTP */
describe("HeroService", () => {
  let mockMessageService;
  let HttpTestingController1: HttpTestingController; //handle to the mock http client => can adjust the module for our neens
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(["add"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], //mock HTTP client module
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService },
      ],
    });

    //** inject() accesses the DI registry. used to create a handler for the service etc. */
    HttpTestingController1 = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroService);
  });

  describe("getHero", () => {
    it("should call get with the correct URL", () => {
      //call getHero()
      service.getHero(4).subscribe((hero) => expect(hero.id).toBe(4));
      // service.getHero(3).subscribe();

      //test that the URL was correct
      const req = HttpTestingController1.expectOne("api/heroes/4");

      //** flush lets us decide what data to send back when the call is made */
      req.flush({ id: 4, name: "SupedDude", strength: 100 });
      expect(req.request.method).toBe("GET");

      //**verify that only the calls we specificlly set will be made*/
      HttpTestingController1.verify();
    });
  });

  // describe("getHero", () => {
  //   //**another way to get a handle to the service is using the inject() method that's on the angular-cores testing module (same as TestBed) */
  //   it("should call get with the correct URL", inject(
  //     [HeroService, HttpTestingController1],
  //     (service: HeroService, controller: HttpTestingController) => {
  //       //call getHero()
  //       service.getHero(4).subscribe();

  //       //test that the URL was correect
  //       const req = controller.expectOne("api/heroes/4");
  //       req.flush({ id: 4, name: "SupedDude", strength: 100 });
  //     }
  //   ));
  // });
});
