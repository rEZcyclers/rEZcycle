import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import HomePage from "../src/pages/HomePage";
import "@testing-library/jest-dom";
import { backendContext } from "../src/App";

describe("HomePage", () => {
  it("renders QueryForm when stage is 1", () => {
    // Render the HomePage component with stage 1 within the custom wrapper and Router
    const mockRecyclablesData = [];
    render(
      <MemoryRouter>
        <backendContext.Provider
          value={{
            sideBarState: [true, () => {}],
            recyclablesData: [],
            donatablesData: [],
            ewasteData: [],
          }}
        >
          <HomePage />
        </backendContext.Provider>
      </MemoryRouter>
    );

    // QueryForm should be displayed on stage 1.
    expect(screen.getByTestId("query-form")).toBeInTheDocument();
    expect(screen.queryByTestId("checklist-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("results")).not.toBeInTheDocument();
  });

  //   it("renders ChecklistForm when stage is 2", () => {
  //     // Render the HomePage component with stage 2.
  //     render(<HomePage />);

  //     // Simulate stage change to 2.
  //     fireEvent.click(screen.getByTestId("button-to-stage-2"));

  //     // ChecklistForm should be displayed on stage 2.
  //     expect(screen.queryByTestId("query-form")).not.toBeInTheDocument();
  //     expect(screen.getByTestId("checklist-form")).toBeInTheDocument();
  //     expect(screen.queryByTestId("results")).not.toBeInTheDocument();
  //   });

  //   it("renders Results when stage is 3", () => {
  //     // Render the HomePage component with stage 3.
  //     render(<HomePage />);

  //     // Simulate stage change to 3.
  //     fireEvent.click(screen.getByTestId("button-to-stage-3"));

  //     // Results should be displayed on stage 3.
  //     expect(screen.queryByTestId("query-form")).not.toBeInTheDocument();
  //     expect(screen.queryByTestId("checklist-form")).not.toBeInTheDocument();
  //     expect(screen.getByTestId("results")).toBeInTheDocument();
  //   });
});
