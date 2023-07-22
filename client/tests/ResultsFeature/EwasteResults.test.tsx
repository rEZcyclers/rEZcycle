import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import EwasteResults from "../../src/components/ResultsPageComponents/EwasteResults";
import {
  DonateOrganisationLocations,
  EbinLocations,
  EwasteItem,
  LocationInfo,
  RepairLocation,
} from "../../src/DataTypes";

const mockEwaste: EwasteItem = {
  ewaste_id: 1,
  ewaste_type: "mock ewaste",
  description: "test",
  is_regulated: true,
  remarks: "-",
  images: [],
};

const mockClosestLoc: LocationInfo | null = {
  locationType: "mock location",
  item: "mock item",
  name: "mock name",
  address: "mock address",
  contact: "mock contact",
  lat: 1,
  lng: 1,
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

const mockEbinResult: EbinLocations[] = [
  {
    ebin: {
      ebin_id: 1,
      ebin_name: "mock ebin",
      website: "mock website",
    },
    ebinLocations: [
      {
        ebinLoc_id: 1,
        ebin_id: 1,
        location: "mock location",
        address: "mock address",
        postal_code: 100000,
        latitude: 1,
        longitude: 1,
      },
    ],
  },
];

describe("EwasteResults", () => {
  it("should not render if no ewaste data is given", () => {
    render(
      <EwasteResults
        allEwaste={[]}
        ebinEwaste={[]}
        goodEwaste={[]}
        regulatedEwaste={[]}
        repairEwaste={[]}
        goodEwasteResults={[]}
        repairEwasteResults={[]}
        ebinEwasteResults={[]}
        showEEResults={[]}
        handleshowEEResults={(i: number) => {}}
        showGEResults={[]}
        handleShowGEResults={(i: number) => {}}
        showREResults={[]}
        handleShowREResults={(i: number) => {}}
        showEEMarkers={[]}
        handleShowEEMarkers={(i: number) => {}}
        showGEMarkers={[]}
        handleShowGEMarkers={(i: number) => {}}
        showREMarkers={[]}
        handleShowREMarkers={(i: number) => {}}
        preferredGELoc={[]}
        preferredRELoc={[]}
        preferredEELoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const ewasteHeader = screen.queryByText("Ewaste", { exact: false });
    expect(ewasteHeader).not.toBeInTheDocument();
  });

  it("should render ebin/regulated ewaste results if only ebin/regulated ewaste data is given", () => {
    render(
      <EwasteResults
        allEwaste={[mockEwaste]}
        ebinEwaste={[mockEwaste]}
        goodEwaste={[]}
        regulatedEwaste={[mockEwaste]}
        repairEwaste={[]}
        goodEwasteResults={[]}
        repairEwasteResults={[]}
        ebinEwasteResults={[mockEbinResult]}
        showEEResults={[]}
        handleshowEEResults={(i: number) => {}}
        showGEResults={[]}
        handleShowGEResults={(i: number) => {}}
        showREResults={[]}
        handleShowREResults={(i: number) => {}}
        showEEMarkers={[]}
        handleShowEEMarkers={(i: number) => {}}
        showGEMarkers={[]}
        handleShowGEMarkers={(i: number) => {}}
        showREMarkers={[]}
        handleShowREMarkers={(i: number) => {}}
        preferredGELoc={[]}
        preferredRELoc={[]}
        preferredEELoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const ebinHeader = screen.queryByText("at the following ebins", {
      exact: false,
    });
    const regulatedHeader = screen.queryByText("regulated ewaste items", {
      exact: false,
    });
    const goodHeader = screen.queryByText("good condition", {
      exact: false,
    });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    expect(ebinHeader).toBeInTheDocument();
    expect(regulatedHeader).toBeInTheDocument();
    expect(goodHeader).not.toBeInTheDocument();
    expect(repairHeader).not.toBeInTheDocument();
  });

  it("should render all ewaste results correctly given all ewaste data", () => {
    render(
      <EwasteResults
        allEwaste={[mockEwaste]}
        ebinEwaste={[mockEwaste]}
        goodEwaste={[mockEwaste]}
        regulatedEwaste={[mockEwaste]}
        repairEwaste={[mockEwaste]}
        goodEwasteResults={[mockGoodResult]}
        repairEwasteResults={[mockRepairResult]}
        ebinEwasteResults={[mockEbinResult]}
        showEEResults={[]}
        handleshowEEResults={(i: number) => {}}
        showGEResults={[]}
        handleShowGEResults={(i: number) => {}}
        showREResults={[]}
        handleShowREResults={(i: number) => {}}
        showEEMarkers={[]}
        handleShowEEMarkers={(i: number) => {}}
        showGEMarkers={[]}
        handleShowGEMarkers={(i: number) => {}}
        showREMarkers={[]}
        handleShowREMarkers={(i: number) => {}}
        preferredGELoc={[]}
        preferredRELoc={[]}
        preferredEELoc={[]}
        showClosest={false}
      />,
      { wrapper: MemoryRouter }
    );
    const ebinHeader = screen.queryByText("at the following ebins", {
      exact: false,
    });
    const regulatedHeader = screen.queryByText("regulated ewaste items", {
      exact: false,
    });
    const goodHeader = screen.queryByText("good condition", {
      exact: false,
    });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    expect(ebinHeader).toBeInTheDocument();
    expect(regulatedHeader).toBeInTheDocument();
    expect(goodHeader).toBeInTheDocument();
    expect(repairHeader).toBeInTheDocument();
  });

  it("should render closest locations if available", () => {
    render(
      <EwasteResults
        allEwaste={[mockEwaste]}
        ebinEwaste={[mockEwaste]}
        goodEwaste={[mockEwaste]}
        regulatedEwaste={[mockEwaste]}
        repairEwaste={[mockEwaste]}
        goodEwasteResults={[mockGoodResult]}
        repairEwasteResults={[mockRepairResult]}
        ebinEwasteResults={[mockEbinResult]}
        showEEResults={[]}
        handleshowEEResults={(i: number) => {}}
        showGEResults={[]}
        handleShowGEResults={(i: number) => {}}
        showREResults={[]}
        handleShowREResults={(i: number) => {}}
        showEEMarkers={[]}
        handleShowEEMarkers={(i: number) => {}}
        showGEMarkers={[]}
        handleShowGEMarkers={(i: number) => {}}
        showREMarkers={[]}
        handleShowREMarkers={(i: number) => {}}
        preferredGELoc={[mockClosestLoc]}
        preferredRELoc={[mockClosestLoc]}
        preferredEELoc={[mockClosestLoc]}
        showClosest={true}
      />,
      { wrapper: MemoryRouter }
    );
    const ebinHeader = screen.queryByText("at the following ebins", {
      exact: false,
    });
    const regulatedHeader = screen.queryByText("regulated ewaste items", {
      exact: false,
    });
    const goodHeader = screen.queryByText("good condition", {
      exact: false,
    });
    const repairHeader = screen.queryByText("can be repaired", {
      exact: false,
    });
    const closestLocations = screen.queryAllByText("closest location", {
      exact: false,
    });
    expect(ebinHeader).toBeInTheDocument();
    expect(regulatedHeader).toBeInTheDocument();
    expect(goodHeader).toBeInTheDocument();
    expect(repairHeader).toBeInTheDocument();
    expect(closestLocations.length).toBe(3);
  });

  it("should inform user if no results were found for any items", () => {
    render(
      <EwasteResults
        allEwaste={[mockEwaste]}
        ebinEwaste={[]}
        goodEwaste={[mockEwaste]}
        regulatedEwaste={[]}
        repairEwaste={[mockEwaste]}
        goodEwasteResults={[[]]}
        repairEwasteResults={[[]]}
        ebinEwasteResults={[]}
        showEEResults={[]}
        handleshowEEResults={(i: number) => {}}
        showGEResults={[]}
        handleShowGEResults={(i: number) => {}}
        showREResults={[]}
        handleShowREResults={(i: number) => {}}
        showEEMarkers={[]}
        handleShowEEMarkers={(i: number) => {}}
        showGEMarkers={[]}
        handleShowGEMarkers={(i: number) => {}}
        showREMarkers={[]}
        handleShowREMarkers={(i: number) => {}}
        preferredGELoc={[mockClosestLoc]}
        preferredRELoc={[mockClosestLoc]}
        preferredEELoc={[mockClosestLoc]}
        showClosest={true}
      />,
      { wrapper: MemoryRouter }
    );
    const goodHeader = screen.queryByText("good condition", {
      exact: false,
    });
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
