import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { backendContext } from "../src/App";
import "@testing-library/jest-dom";
import Ewaste from "../src/components/QueryFormComponents/Ewaste";

describe("Ewaste component", () => {
  it("Renders all Ewaste chips", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <backendContext.Provider
          value={{
            sideBarState: [true, () => {}],
            ewasteData: [
              {
                ewaste_id: 1,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
              {
                ewaste_id: 2,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
              {
                ewaste_id: 3,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
              {
                ewaste_id: 4,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
              {
                ewaste_id: 5,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
              {
                ewaste_id: 6,
                ewaste_type: "a",
                description: "A",
                is_regulated: true,
                remarks: "a",
                images: [],
              },
            ],
          }}
        >
          <Ewaste
            selectedEwaste={[false, false]}
            setSelectedEwaste={() => {}}
            numSelectedItems={0}
            setNumSelectedItems={() => {}}
          />
        </backendContext.Provider>
      </MemoryRouter>
    );
    for (let i = 1; i <= 6; i++) {
      expect(getByTestId(`EwasteChip-${i}`)).toBeInTheDocument();
    }
  });
});
