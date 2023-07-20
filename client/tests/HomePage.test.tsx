import { describe, it, expect } from "vitest";
import React, { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../src/pages/HomePage";
import "@testing-library/jest-dom";


// Define the type for the children prop
interface MockedWrapperProps {
  children: React.ReactNode;
}

// Mock any components or modules that are used in HomePage, but aren't relevant to the current test.
// Create a custom wrapper component to mock the backendContext
const MockedWrapper: React.FC<MockedWrapperProps> = ({ children }) => {
  // Mock backendContext with a non-null sideBarState
  //   const backendContext = {
  //     sideBarState: [true, () => {}], // Mocked value for sideBarState
  //   };
  const backendContext = {
    serverAPI: "https://example.com",
    sideBarState: [true, () => {}], // Mocked value for sideBarState
    userSession: null,
    userProfile: null,
    recyclablesData: [], // 
    donatablesData: [],
    ewasteData: [],
    bluebinsData: [],
    donateOrgData: [],
    donateLocData: [],
    repairLocData: [],
    ebinData: [],
    ebinLocData: [],
    DDOrgData: [],
    DRLocData: [],
    EDOrgData: [],
    ERLocData: [],
    EEData: [],
  };

  // Create a context provider with the mocked backendContext
  const BackendContextProvider = React.createContext(backendContext);

  // Use the context provider to wrap the children
  return (
    <BackendContextProvider.Provider value={backendContext}>
      {children}
    </BackendContextProvider.Provider>
  );
};

describe("HomePage", () => {
  it("renders QueryForm when stage is 1", () => {
    // Render the HomePage component with stage 1 within the custom wrapper and Router
    render(
        <MockedWrapper>
          <HomePage />
        </MockedWrapper>
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

  // You can write more test cases to test other functionalities and interactions.
});
