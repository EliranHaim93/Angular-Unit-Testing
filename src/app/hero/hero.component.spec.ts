import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

describe("HeroComponent (shallow)", () => {
  let fixture: ComponentFixture<HeroComponent>; //wrapper for a component

  //to create a integrated test we need to have a module that connects the components that are tested. for that we need the "TestBed" object with the .configureTestingModule()
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA], //scemas to proccess the HTML that is been handed
      //NO_ERROR_SCEMA => don't validate the template
    });

    //creating the component
    fixture = TestBed.createComponent(HeroComponent); //=> returns a component fixture, so best practice is to create a fixture variable.

    //**the actual component */
    // fixture.componentInstance;
  });

  it("should have the correct hero", () => {
    fixture.componentInstance.hero = { id: 1, name: "SuperDude", strength: 3 };
    fixture.detectChanges(); // always call detectChanges()

    expect(fixture.componentInstance.hero.name).toEqual("SuperDude");
  });

  it("should render the hero name in an anchor tag", () => {
    fixture.componentInstance.hero = { id: 1, name: "SuperDude", strength: 3 };
    fixture.detectChanges();

    // fixture.nativeElement => expose the DOM API
    // fixture.debugElenemt => a way to access to the root template, a wrapper arround the DOM node and not the entire template

    let debugElenent = fixture.debugElement.query(By.css("a"));
    expect(debugElenent.nativeElement.textContent).toContain("SuperDude");

    expect(fixture.nativeElement.querySelector("a").textContent).toContain(
      "SuperDude"
    );
  });
});
