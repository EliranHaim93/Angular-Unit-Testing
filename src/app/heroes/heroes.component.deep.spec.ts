//** deep integration tests are used to test with LIVE chiled components and colaborators */
import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

//** mocking RuterLink directive. This example is set to listen to the routerLink and if the host is "clicked" will trigger the "onclick" method that will recorn the path */
@Directive({
  selector: "[routerLink]",
  host: { "(click)": "onClick()" },
})
export class RouterLinkDirectiveStub {
  @Input("routerLink") linkParams: any;
  navigateTo: any = null;

  onClick() {
    this.navigateTo = this.linkParams;
  }
}

//** integration example */
describe("HerosComponent (deep tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "SpiderDude", strength: 8 },
      { id: 2, name: "Wonderful Woman", strength: 24 },
      { id: 3, name: "SuperDude", strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      // schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
      ],
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should render each hero as a HeroComponent", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges(); //when called on a parent all chiled components will also be initialized

    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    expect(heroComponentsDEs.length).toBe(3);

    //** check if every hero on each hero component matches with the correct  hero in the sample data passed by the parent  */
    for (let i = 0; i < heroComponentsDEs.length; i++) {
      expect(heroComponentsDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  //**trigger event on child component */
  it(`should call heroeService.deleteHero when the hero component's delete button is clicked`, () => {
    //** spying on amethod to see if it is called and with what data */
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    //**triggerEventHandler => triggers event by name and an object*/
    // heroComponents[0]
    //   .query(By.css("button"))
    //   .triggerEventHandler("click", { stopPropagation: () => {} });

    //**triggering the delete event directly instead of triggering a click that triggers a delete */
    (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined); // this methodoligy is for triggering the event on the child component

    //**another method is to trigger A event that matches our need from the emmiting component */
    // heroComponents[0].triggerEventHandler('delete', null)

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  //** invoking input elements*/
  it("should add a new hero to the hero list when the add button is clicked", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const name = "Mr. Ice";
    mockHeroService.addHero.and.returnValue(
      of({ id: 5, name: name, strength: 4 })
    );
    //**input element handler */
    const inputElement = fixture.debugElement.query(
      By.css("input")
    ).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css("button"))[0];

    inputElement.value = name;
    addButton.triggerEventHandler("click", null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css("ul")).nativeElement
      .textContent;

    expect(heroText).toContain(name);
  });

  it("should have the correct route for the first hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css("a")).triggerEventHandler("click", null);

    expect(routerLink.navigateTo).toBe("/detail/1");
  });
});
