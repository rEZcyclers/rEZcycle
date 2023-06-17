import { useState } from "react";
import { useContext } from "react";
import { backendContext } from "../App";
import Base from "../components/Base";
import QueryForm from "../components/QueryForm";
import ChecklistForm from "../components/ChecklistForm";
import ResultsPage from "../components/ResultsPage";

type Condition = "Good" | "Repairable" | "Spoilt" | "";

function HomePage() {
  // use backendData state
  const { backendData } = useContext(backendContext);

  // states required for finding results: selected items & their conditions
  const [selectedItems, setSelectedItems] = useState<boolean[][]>([
    new Array<boolean>(26).fill(false),
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

  const [eWasteConditions, setEWasteConditions] = useState<Condition[]>(
    selectedItems[2].map(() => "")
  );

  return (
    <Base>
      <ul>
        {backendData?.map((item: any) => {
          return <li>{item}</li>;
        })}
      </ul>
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
          eWasteConditions={eWasteConditions}
          setEWasteConditions={setEWasteConditions}
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
          eWasteConditions={eWasteConditions}
          setEWasteConditions={setEWasteConditions}
        />
      )}
    </Base>
  );
}

export default HomePage;
