import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { backendContext } from "../src/App";
import "@testing-library/jest-dom";
import Donatables from "../src/components/QueryFormComponents/Donatables";

describe("Donatables component", () => {
  it("Renders all Donatable chips", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <backendContext.Provider
          value={{
            sideBarState: [true, () => {}],
            donatablesData: [
              {
                donatable_id: 1,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 2,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 3,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 4,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 5,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 6,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 7,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 8,
                donatable_type: "a",
                description: "a",
                images: [],
              },
              {
                donatable_id: 9,
                donatable_type: "a",
                description: "a",
                images: [],
              },
            ],
          }}
        >
          <Donatables
            selectedDonatables={[false, false]}
            setSelectedDonatables={() => {}}
            numSelectedItems={0}
            setNumSelectedItems={() => {}}
          />
        </backendContext.Provider>
      </MemoryRouter>
    );
    for (let i = 1; i <= 9; i++) {
      expect(getByTestId(`DonatableChip-${i}`)).toBeInTheDocument();
    }
  });
});
