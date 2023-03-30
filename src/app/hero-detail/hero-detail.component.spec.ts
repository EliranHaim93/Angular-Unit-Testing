import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import { Location } from "@angular/common";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";

//**testing routing components */
describe("HeroDetailComponent", () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => {
            return "3";
          },
        },
      },
    };

    mockHeroService = jasmine.createSpyObj(["getHero", "updateHero"]);
    mockLocation = jasmine.createSpyObj(["back"]);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ],
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(
      of({ id: 3, name: "superDude", strength: 100 })
    );
  });

  it("should render hero name in a h2 tag", () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("h2").textContent).toContain(
      "SUPERDUDE"
    );
  });

  //** test async code */
  //basic way
  // it("should call update hero when save is called", (done) => {
  //   mockHeroService.updateHero.and.returnValue(of({}));
  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   setTimeout(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //     done();
  //   }, 300);
  // });

  //better way also works with promises
  it("should call update hero when save is called", fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    //**fast forward x amout of ms */
    // tick(250);

    //** flush=> looks at the zone to check if there are waiting tasks. if there are waiting tasks => fast forward the clock untill all tasks are executed  */
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  //** test promise code */
  it("should call update hero when save is called using promise", waitForAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();

    //** whenStable => wait for any promises that are waiting to resolve and then execute your code => returns a promise*/
    fixture.whenStable().then(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    });
  }));
});
