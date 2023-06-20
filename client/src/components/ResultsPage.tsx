import { useContext, useEffect } from "react";
import {
  DonatableItem,
  EWasteItem,
  RecyclableItem,
  DonateLocation,
  RepairLocation,
  backendContext,
} from "../App";
import { Box, Button, Stack, Typography } from "@mui/material";
import { supabase } from "../supabase";
import { ReceiptLong } from "@mui/icons-material";

type Condition = "Good" | "Repairable" | "Spoilt" | "";
interface Props {
  stage: number;
  setStage: (num: number) => void;
  selectedItems: boolean[][];
  recyclableConditions: boolean[];
  setRecyclableConditions: (newArray: boolean[]) => void;
  donatableConditions: Condition[];
  setDonatableConditions: (newArray: Condition[]) => void;
  eWasteConditions: Condition[];
  setEWasteConditions: (newArray: Condition[]) => void;
}

function ResultsPage({
  selectedItems,
  recyclableConditions,
  donatableConditions,
  eWasteConditions,
  setStage,
}: Props) {
  // Retrive raw data first
  const { recyclablesData, donatablesData, eWasteData } =
    useContext(backendContext);

  let recyclablesResults: RecyclableItem[] = []; // Selected recyclables which can be disposed in blue bins
  let unrecyclablesResults: RecyclableItem[] = []; // Selected recyclables which CANNOT be disposed in blue bins

  let goodDonatables: DonatableItem[] = []; // Selected donatables in good condition
  let repairDonatables: DonatableItem[] = []; // Selected donatables in repairable condition
  let spoiltDonatables: DonatableItem[] = []; // Selected donatables in spoilt condition
  let goodDonatablesResults: DonateLocation[][] = []; // List of donateLocations for every selected good donatable
  let repairDonatablesResults: RepairLocation[][] = []; // List of repairLocations for every selected repairable donatable

  let goodEWaste: EWasteItem[] = []; // Selected EWaste in good condition
  let repairEWaste: EWasteItem[] = []; // Selected EWaste in repairable condition
  let spoiltEWaste: EWasteItem[] = []; // Selected EWaste in spoilt condition
  let goodEWasteResults: DonateLocation[][] = []; // List of donateLocations for every selected good EWaste
  let repairEWasteResults: RepairLocation[][] = []; // List of repairLocations for every selected repairable EWaste

  function getResults() {
    recyclablesResults = selectedItems[0]
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          recyclableConditions[i] &&
          recyclablesData[i]["bluebin_eligibility"] != 0
      )
      .map((i) => recyclablesData[i]);
    // OR
    // const recyclablesResults = recyclablesData.filter(
    //   (item: RecyclableItem, index: number) => {
    //     selectedItems[index] &&
    //       recyclableConditions[index] &&
    //       item["bluebin_eligibility"] != 0;
    //   }
    // );

    unrecyclablesResults = selectedItems[0]
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          (recyclablesData[i]["bluebin_eligibility"] === 0 ||
            !recyclableConditions[i])
      )
      .map((i) => recyclablesData(i));

    goodDonatables = donatableConditions
      .map((cond, i) => (cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);

    repairDonatables = donatableConditions
      .map((cond, i) => (cond === "Repairable" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);

    spoiltDonatables = donatableConditions
      .map((cond, i) => (cond === "Spoilt" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);

    goodDonatablesResults = goodDonatables.map(async (item: DonatableItem) => {
      const { data, error } = await supabase
        .from("DonatablesDonateLocations")
        .select()
        .match({ donatable_id: item["donatable_id"] });
      const locations =
        data === null
          ? []
          : data.map(async (entry) => {
              await supabase
                .from("donateLocations")
                .select()
                .match({ donate_id: entry["donate_id"] });
            });
      return locations;
    });

    goodEWaste = eWasteConditions
      .map((cond, i) => (cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => eWasteData[i]);

    repairEWaste = eWasteConditions
      .map((cond, i) => (cond === "Repairable" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => eWasteData[i]);

    spoiltEWaste = eWasteConditions
      .map((cond, i) => (cond === "Spoilt" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => eWasteData[i]);
  }
  useEffect(() => getResults());

  const handleBackClick = () => {
    setStage(2);
  };

  getResults();

  return (
    <>
      <h1>Here's where to recycle your items</h1>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        {recyclablesResults.length != 0 && (
          <Box flex={1}>
            <h2>Recyclables</h2>
            <h4>These items can be recycled at the nearest blue bins:</h4>
            {recyclablesResults.map((item: RecyclableItem) => {
              return <Typography variant="body1">{item["name"]}</Typography>;
            })}
          </Box>
        )}
        {(goodDonatables.length != 0 || repairDonatables.length != 0) && (
          <Box flex={1}>
            <h2>Donatables</h2>
            {goodDonatables.length != 0 && (
              <>
                <h4>Here's where to donate the following donatables</h4>
                {goodDonatables.map((item: DonatableItem, index: number) => {
                  return (
                    <div>
                      <Typography variant="body1">
                        {item["donatable_type"] + ": "}
                      </Typography>
                      <ul>
                        <li>test</li>
                        {/* {goodDonatablesResults[index].map((location: any) => {
                    return <li>hi</li>;
                  })} */}
                      </ul>
                    </div>
                  );
                })}
              </>
            )}
            {repairDonatables.length != 0 && (
              <>
                <h4>Here's where to repair the following donatables</h4>
                {repairDonatables.map((item: DonatableItem) => (
                  <Typography variant="body1">
                    {item["donatable_type"]}
                  </Typography>
                ))}
              </>
            )}
          </Box>
        )}
        {(goodEWaste.length != 0 || repairEWaste.length != 0) && (
          <>
            <Box flex={1}>
              <h2>EWaste</h2>
              {goodEWaste.length != 0 && (
                <>
                  <h4>Here's where to donate the following EWaste</h4>
                  {goodEWaste.map((item: EWasteItem) => {
                    return (
                      <Typography variant="body1">
                        {item["eWaste_type"]}
                      </Typography>
                    );
                  })}
                </>
              )}
              {repairEWaste.length != 0 && (
                <>
                  <h4>Here's where to repair the following EWaste</h4>
                  {repairEWaste.map((item: EWasteItem) => {
                    return (
                      <Typography variant="body1">
                        {item["eWaste_type"]}
                      </Typography>
                    );
                  })}
                </>
              )}
            </Box>
          </>
        )}
      </Stack>
      {(unrecyclablesResults.length != 0 ||
        spoiltDonatables.length != 0 ||
        spoiltEWaste.length != 0) && (
        <>
          <h2>These items need to be disposed as general waste:</h2>
          <Stack>
            {unrecyclablesResults.map((item: RecyclableItem) => {
              return <Typography variant="body1">{item["name"]}</Typography>;
            })}
            {spoiltDonatables.map((item: DonatableItem) => {
              return (
                <Typography variant="body1">
                  {item["donatable_type"]}
                </Typography>
              );
            })}
            {spoiltEWaste.map((item: EWasteItem) => {
              return (
                <Typography variant="body1">{item["eWaste_type"]}</Typography>
              );
            })}
          </Stack>
        </>
      )}
      <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={handleBackClick} sx={{ mr: 10 }}>
          Back
        </Button>
      </Box>
    </>
  );
}

export default ResultsPage;
