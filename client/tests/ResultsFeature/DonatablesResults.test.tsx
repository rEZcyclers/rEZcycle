import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import {
  DonatableItem,
  DonateOrganisationLocations,
  LocationInfo,
  RepairLocation,
} from "../../src/DataTypes";
import DonatablesResults from "../../src/components/ResultsPageComponents/DonatablesResults";

const mockDonatable: DonatableItem = {
  donatable_id: 1,
  donatable_type: "mock donatable",
  description: "test",
  images: [],
};

const mockGoodResult: DonateOrganisationLocations[] = [
  {
    donateOrg: {
      donateOrg_id: 1,
      organisation_name: "mock organisation",
      reuse_channel: "mock",
    },
    donateLocations: [
      {
        donateLoc_id: 1,
        donateOrg_id: 1,
        location_name: "mock location",
        address: "mock address",
        contact: "mock contact",
        latitude: 1,
        longitude: 1,
      },
    ],
  },
];

const mockRepairResult: RepairLocation[] = [
  {
    repair_id: 1,
    center_name: "mock center",
    stall_number: "mock stall",
    repair_type: "mock repair",
    latitude: 1,
    longitude: 1,
  },
];

const mockClosestLoc: LocationInfo | null = {
  locationType: "mock location",
  item: "mock item",
  name: "mock name",
  address: "mock address",
  contact: "mock contact",
  lat: 1,
  lng: 1,
};

describe("DonatablesResults", () => {
  it("shouldn't render at all if no donatables data is given", () => {
    render(
      <DonatablesResults
        goodDonatables={[]}
        repairDonatables={[]}
        handleShowGDResults={(i: number) => {}}
        showGDResults={[]}
        goodDonatablesResults={[]}
        showGDMarkers={[]}
        handleShowGDMarkers={(i: number) => {}}
        showRDResults={[]}
        repairDonatablesResults={[]}
        handleShowRDResults={(i: number) => {}}
        showRDMarkers={[]}
        handleShowRDMarkers={(i: number) => {}}
        preferredGDLoc={[]}
        preferredRDLoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const donatablesHeader = screen.queryByText("donatables", { exact: false });
    expect(donatablesHeader).not.toBeInTheDocument();
  });

  it("should render good donatables results if only good donatables data is given", () => {
    render(
      <DonatablesResults
        goodDonatables={[mockDonatable]}
        repairDonatables={[]}
        handleShowGDResults={(i: number) => {}}
        showGDResults={[]}
        goodDonatablesResults={[mockGoodResult]}
        showGDMarkers={[]}
        handleShowGDMarkers={(i: number) => {}}
        showRDResults={[]}
        repairDonatablesResults={[]}
        handleShowRDResults={(i: number) => {}}
        showRDMarkers={[]}
        handleShowRDMarkers={(i: number) => {}}
        preferredGDLoc={[]}
        preferredRDLoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const goodHeader = screen.queryByText("can be donated", { exact: false });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    expect(goodHeader).toBeInTheDocument();
    expect(repairHeader).not.toBeInTheDocument();
  });

  it("should render repair results if only repair donatables data is given", () => {
    render(
      <DonatablesResults
        goodDonatables={[]}
        repairDonatables={[mockDonatable]}
        handleShowGDResults={(i: number) => {}}
        showGDResults={[]}
        goodDonatablesResults={[]}
        showGDMarkers={[]}
        handleShowGDMarkers={(i: number) => {}}
        showRDResults={[]}
        repairDonatablesResults={[mockRepairResult]}
        handleShowRDResults={(i: number) => {}}
        showRDMarkers={[]}
        handleShowRDMarkers={(i: number) => {}}
        preferredGDLoc={[]}
        preferredRDLoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const goodHeader = screen.queryByText("can be donated", { exact: false });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    expect(goodHeader).not.toBeInTheDocument();
    expect(repairHeader).toBeInTheDocument();
  });

  it("should render closest locations if available", () => {
    render(
      <DonatablesResults
        goodDonatables={[mockDonatable]}
        repairDonatables={[mockDonatable]}
        handleShowGDResults={(i: number) => {}}
        showGDResults={[]}
        goodDonatablesResults={[mockGoodResult]}
        showGDMarkers={[]}
        handleShowGDMarkers={(i: number) => {}}
        showRDResults={[]}
        repairDonatablesResults={[mockRepairResult]}
        handleShowRDResults={(i: number) => {}}
        showRDMarkers={[]}
        handleShowRDMarkers={(i: number) => {}}
        preferredGDLoc={[mockClosestLoc]}
        preferredRDLoc={[mockClosestLoc]}
        showClosest={true}
      />,
      { wrapper: MemoryRouter }
    );
    const goodHeader = screen.queryByText("can be donated", { exact: false });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    const closestLocations = screen.queryAllByText("closest location", {
      exact: false,
    });
    expect(goodHeader).toBeInTheDocument();
    expect(repairHeader).toBeInTheDocument();
    expect(closestLocations.length).toBe(2);
  });

  it("should inform user if no results were found for any items", () => {
    render(
      <DonatablesResults
        goodDonatables={[mockDonatable]}
        repairDonatables={[mockDonatable]}
        handleShowGDResults={(i: number) => {}}
        showGDResults={[]}
        goodDonatablesResults={[[]]}
        showGDMarkers={[]}
        handleShowGDMarkers={(i: number) => {}}
        showRDResults={[]}
        repairDonatablesResults={[[]]}
        handleShowRDResults={(i: number) => {}}
        showRDMarkers={[]}
        handleShowRDMarkers={(i: number) => {}}
        preferredGDLoc={[]}
        preferredRDLoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const goodHeader = screen.queryByText("can be donated", { exact: false });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    const noResults = screen.queryAllByText("oops", {
      exact: false,
    });
    expect(goodHeader).toBeInTheDocument();
    expect(repairHeader).toBeInTheDocument();
    expect(noResults.length).toBe(2);
  });
});
