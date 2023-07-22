import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { backendContext } from "../src/App";
import "@testing-library/jest-dom";
import QueryForm from "../src/components/QueryForm";

describe("QueryForm component", () => {
  it("Renders Recyclables, Donatables, and Ewaste", () => {
    const { getByText } = render(
      <MemoryRouter>
        <backendContext.Provider
          value={{
            sideBarState: [true, () => {}],
            recyclablesData: [],
            donatablesData: [],
            ewasteData: [],
          }}
        >
          <QueryForm
            setStage={() => {}}
            selectedRecyclables={[]}
            selectedDonatables={[]}
            selectedEwaste={[]}
            setSelectedRecyclables={() => {}}
            setSelectedDonatables={() => {}}
            setSelectedEwaste={() => {}}
            numSelectedItems={0}
            setNumSelectedItems={() => {}}
            clearForm={() => {}}
          />
        </backendContext.Provider>
      </MemoryRouter>
    );
    expect(getByText("Recyclables")).toBeInTheDocument();
    expect(getByText("Donatables")).toBeInTheDocument();
    expect(getByText("E-waste")).toBeInTheDocument();
  });
});
