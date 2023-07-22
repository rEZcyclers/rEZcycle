import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { LocationInfo, RecyclableItem } from "../../src/DataTypes";
import RecyclablesResults from "../../src/components/ResultsPageComponents/RecyclablesResults";

const mockRecyclableItem: RecyclableItem = {
  recyclable_id: 1,
  material: "PAPER",
  name: "mock item",
  bluebin_eligibility: 1,
  checklist: "mock checklist",
};

const mockClosestBBLoc: LocationInfo | null = {
  locationType: "bluebin",
  item: "mock item",
  name: "mock name",
  address: "mock address",
  contact: "mock contact",
  lat: 1,
  lng: 1,
};

describe("RecyclablesResults", () => {
  it("should not render if no data is given", () => {
    render(
      <RecyclablesResults
        recyclablesResults={[]}
        showBluebin={false}
        handleShowBluebin={() => {}}
        closestBBLoc={null}
      />,
      { wrapper: MemoryRouter }
    );
    const recyclableHeader = screen.queryByText("can be recycled", {
      exact: false,
    });
    expect(recyclableHeader).not.toBeInTheDocument();
  });
  it("should render recyclable results if data is given", () => {
    render(
      <RecyclablesResults
        recyclablesResults={[mockRecyclableItem]}
        showBluebin={false}
        handleShowBluebin={() => {}}
        closestBBLoc={mockClosestBBLoc}
      />,
      { wrapper: MemoryRouter }
    );
    const recyclableHeader = screen.getByText("can be recycled", {
      exact: false,
    });
    expect(recyclableHeader).toBeInTheDocument();
  });
  it("should render closest bluebin info if available", () => {
    render(
      <RecyclablesResults
        recyclablesResults={[mockRecyclableItem]}
        showBluebin={true}
        handleShowBluebin={() => {}}
        closestBBLoc={mockClosestBBLoc}
      />,
      { wrapper: MemoryRouter }
    );
    const closestBluebin = screen.getByText("closest bluebin", {
      exact: false,
    });
    expect(closestBluebin).toBeInTheDocument();
  });
});
