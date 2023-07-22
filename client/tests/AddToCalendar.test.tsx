import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { backendContext } from "../src/App";
import "@testing-library/jest-dom";
import ChecklistForm from "../src/components/ChecklistForm";
import AddtoCalendar from "../src/components/AddToCalendar";

describe("ChecklistForm component", () => {
  it("Renders Recyclables, Donatables and Ewaste checklists", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <backendContext.Provider
          value={{
            sideBarState: [true, () => {}],
            recyclablesData: [
              {
                recyclable_id: 1,
                material: "PAPER",
                name: "glossy",
                bluebin_eligibility: 1,
                checklist: "bla",
              },
            ],
            donatablesData: [
              {
                donatable_id: 1,
                donatable_type: "a",
                description: "a",
                images: [],
              },
            ],
            ewasteData: [
              {
                ewaste_id: 1,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
            ],
          }}
        >
          <AddtoCalendar
            closestBBLoc={null}
            goodDonatables={[]}
            repairDonatables={[]}
            goodEwaste={[]}
            repairEwaste={[]}
            allEwaste={[]}
            preferredGDLoc={[]}
            preferredRDLoc={[null]}
            preferredGELoc={[]}
            preferredRELoc={[null]}
            preferredEELoc={[]}
          />
        </backendContext.Provider>
      </MemoryRouter>
    );
    expect(getByTestId("AddToCalendarButton")).toBeInTheDocument();
  });
});
