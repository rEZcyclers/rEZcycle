import { describe, test, it, expect, vi } from "vitest";
import React from "react";
import {
  render,
} from "@testing-library/react";
import Recyclables from "../src/components/QueryFormComponents/Recyclables";
import { MemoryRouter } from "react-router-dom";
import { backendContext } from "../src/App";
import "@testing-library/jest-dom";

describe("Recyclables component", () => {
  it("Renders Autocomplete components for all materials", () => {
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
              {
                recyclable_id: 2,
                material: "PAPER",
                name: "matte",
                bluebin_eligibility: 1,
                checklist: "blab",
              },
            ],
          }}
        >
          <Recyclables
            selectedRecyclables={[false, false]}
            setSelectedRecyclables={() => {}}
            numSelectedItems={0}
            setNumSelectedItems={() => {}}
          />
        </backendContext.Provider>
      </MemoryRouter>
    );
    expect(getByTestId("materialAutocomplete-0")).toBeInTheDocument();
    expect(getByTestId("materialAutocomplete-1")).toBeInTheDocument();
    expect(getByTestId("materialAutocomplete-2")).toBeInTheDocument();
    expect(getByTestId("materialAutocomplete-3")).toBeInTheDocument();
  });
});
