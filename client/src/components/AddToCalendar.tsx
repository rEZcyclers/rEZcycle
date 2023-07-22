import { AddToCalendarButton } from "add-to-calendar-button-react";
import { DonatableItem, EwasteItem, LocationInfo } from "../DataTypes";
import { Box } from "@mui/material";
interface Props {
  closestBBLoc: LocationInfo | null;

  goodDonatables: DonatableItem[];
  repairDonatables: DonatableItem[];
  goodEwaste: EwasteItem[];
  repairEwaste: EwasteItem[];
  allEwaste: EwasteItem[];

  preferredGDLoc: LocationInfo[];
  preferredRDLoc: (LocationInfo | null)[];
  preferredGELoc: LocationInfo[];
  preferredRELoc: (LocationInfo | null)[];
  preferredEELoc: LocationInfo[];
}

function AddtoCalendar({
  closestBBLoc,
  goodDonatables,
  repairDonatables,
  goodEwaste,
  repairEwaste,
  allEwaste,
  preferredGDLoc,
  preferredRDLoc,
  preferredGELoc,
  preferredRELoc,
  preferredEELoc,
}: Props) {
  // For the Add to calendar button
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1 and pad with leading zeros if needed
  const day = String(currentDate.getDate()).padStart(2, "0"); // Pad the day component with leading zeros if needed

  const startDate = `${year}-${month}-${day}`;

  let description = "Where to recycle your items: ";

  description +=
    "\n\u2022 Recycle your recyclables at the nearest blue bin: " +
    closestBBLoc?.address;

  for (let i = 0; i < goodDonatables.length; i++) {
    let newline: string = "\n";
    newline +=
      "\u2022 " +
      "Donate " +
      goodDonatables[i]["donatable_type"] +
      " at " +
      preferredGDLoc[i]["address"];
    description += newline;
  }
  for (let i = 0; i < repairDonatables.length; i++) {
    if (preferredRDLoc[i] === null) {
      description +=
        "\n" +
        "\u2022 " +
        "No repair locations found for " +
        repairDonatables[i]["donatable_type"];
      continue;
    }
    let newline: string = "\n";
    newline +=
      "\u2022 " +
      "Repair " +
      repairDonatables[i]["donatable_type"] +
      " at " +
      preferredRDLoc[i]?.address;
    description += newline;
  }
  for (let i = 0; i < goodEwaste.length; i++) {
    let newline: string = "\n";
    newline +=
      "\u2022 " +
      "Donate " +
      goodEwaste[i]["ewaste_type"] +
      " at " +
      preferredGELoc[i]["address"];
    description += newline;
  }
  for (let i = 0; i < repairEwaste.length; i++) {
    if (preferredRDLoc[i] === null) {
      description +=
        "\n" +
        "\u2022 " +
        "No repair locations found for " +
        repairEwaste[i]["ewaste_type"];
      continue;
    }
    let newline: string = "\n";
    newline +=
      "\u2022 " +
      "Repair " +
      repairEwaste[i]["ewaste_type"] +
      " at " +
      preferredRELoc[i]?.address;
    description += newline;
  }
  for (let i = 0; i < allEwaste.length; i++) {
    let newline: string = "\n";
    newline +=
      "\u2022 " +
      "Dispose of  " +
      allEwaste[i]["ewaste_type"] +
      " at " +
      preferredEELoc[i]["address"];
    description += newline;
  }
  return (
    <Box sx={{ mr: 10, mb: 10 }} data-testid={"AddToCalendarButton"}>
      <AddToCalendarButton
        name="Recycling Trip"
        description={description}
        options={[
          "Apple",
          "Google",
          "iCal",
          "Microsoft365",
          "MicrosoftTeams",
          "Outlook.com",
          "Yahoo",
        ]}
        startDate={startDate}
        endDate={startDate}
        startTime="14:00"
        endTime="16:00"
        timeZone="Asia/Singapore"
        buttonStyle="flat"
      ></AddToCalendarButton>
    </Box>
  );
}

export default AddtoCalendar;
