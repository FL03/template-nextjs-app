/**
 * Created At: 2025.10.31:10:11:37
 * @author - @FL03
 * @directory - tests
 * @file - shift.form.test.tsx
 */
import { mount } from "cypress/react";
import { ShiftForm } from "../src/features/shifts";

describe("ShiftForm (Cypress component test)", () => {
  it("renders id, assignee, date and org default values and enables submit", () => {
    const defaultDate = "2025-10-21T12:00:00.000Z";

    mount(
      <ShiftForm
        defaultValues={{
          id: "shift-1",
          date: defaultDate,
          organization_id: "org-override",
          tips_cash: 42,
          assignee: "jdoe",
        }}
      />,
    );

    // hidden shift id
    cy.get('input[name="id"]').should("exist").and("have.value", "shift-1");

    // hidden assignee
    cy.get('input[name="assignee"]').should("exist").and("have.value", "jdoe");

    // date hidden input produced by DateField
    cy.get('input[name="date"]')
      .should("exist")
      .invoke("val")
      .then((val) =>
        expect(new Date(String(val)).toISOString()).to.equal(
          new Date(defaultDate).toISOString(),
        ),
      );

    // OrgSelect stub or real component with data-testid
    cy.get('[data-testid="org-select"]')
      .should("exist")
      .then(($el) => {
        // check forwarded defaultValue when present
        // some implementations expose defaultValue as a prop on the DOM element
        expect(($el.prop("defaultValue") ?? $el.val())).to.equal(
          "org-override",
        );
      });

    // submit/save button enabled when not pending
    cy.get('[data-testid="shift-form-submit"]').should("not.be.disabled");
  });
});