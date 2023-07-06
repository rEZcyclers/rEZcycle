import { useState } from "react";
import Base from "../components/Base";
import QueryForm from "../components/QueryForm";
import ChecklistForm from "../components/ChecklistForm";
import ResultsPage from "../components/ResultsPage";

type Condition = "Good" | "Repairable" | "Spoilt" | "";

function HomePage() {
  // states required for finding results: selected items, their conditions, & which form we're at
  const [selectedItems, setSelectedItems] = useState<boolean[][]>([
    new Array<boolean>(62).fill(false),
    new Array<boolean>(9).fill(false),
    new Array<boolean>(6).fill(false),
  ]);

  const [stage, setStage] = useState(1);

  const [recyclableConditions, setRecyclableConditions] = useState(
    selectedItems[0].map(() => false)
  );

  const [donatableConditions, setDonatableConditions] = useState<Condition[]>(
    selectedItems[1].map(() => "")
  );

  const [ewasteConditions, setEwasteConditions] = useState<Condition[]>(
    selectedItems[2].map(() => "")
  );

  return (
    <Base>
      {stage == 1 ? (
        <QueryForm
          stage={stage}
          setStage={setStage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : stage == 2 ? (
        <ChecklistForm
          stage={stage}
          setStage={setStage}
          selectedItems={selectedItems}
          recyclableConditions={recyclableConditions}
          setRecyclableConditions={setRecyclableConditions}
          donatableConditions={donatableConditions}
          setDonatableConditions={setDonatableConditions}
          ewasteConditions={ewasteConditions}
          setEwasteConditions={setEwasteConditions}
        />
      ) : (
        <ResultsPage
          stage={stage}
          setStage={setStage}
          selectedItems={selectedItems}
          recyclableConditions={recyclableConditions}
          setRecyclableConditions={setRecyclableConditions}
          donatableConditions={donatableConditions}
          setDonatableConditions={setDonatableConditions}
          ewasteConditions={ewasteConditions}
          setEwasteConditions={setEwasteConditions}
        />
      )}
    </Base>
  );
}

export default HomePage;
