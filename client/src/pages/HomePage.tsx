import { useState } from "react";
import Base from "../components/Base";
import QueryForm from "../components/QueryForm";
import ChecklistForm from "../components/ChecklistForm";
// import ResultsPage from "../components/ResultsPage";
import ResultsPage from "../components/ResultsPage";

type Condition = "Good" | "Repairable" | "Spoilt" | "";

function HomePage() {
  ///// states required for finding results: (1) selected items, (2) their conditions, (3) which stage we're at /////

  // (1) selected items
  const [selectedRecyclables, setSelectedRecyclables] = useState<boolean[]>(
    new Array<boolean>(62)
  );
  const [selectedDonatables, setSelectedDonatables] = useState<boolean[]>(
    new Array<boolean>(9)
  );
  const [selectedEwaste, setSelectedEwaste] = useState<boolean[]>(
    new Array<boolean>(6)
  );

  // (2) selected item conditions
  const [recyclableConditions, setRecyclableConditions] = useState(
    selectedRecyclables.map(() => false)
  );
  const [donatableConditions, setDonatableConditions] = useState<Condition[]>(
    selectedDonatables.map(() => "")
  );
  const [ewasteConditions, setEwasteConditions] = useState<Condition[]>(
    selectedEwaste.map(() => "")
  );

  // (3) which stage we're at
  const [stage, setStage] = useState(1);

  // extra state to be able to quickly decide appearance of 'clear' button UI
  const [numSelectedItems, setNumSelectedItems] = useState(0);
  // function for clearing all form selections
  const clearForm = () => {
    setNumSelectedItems(0);
    setSelectedRecyclables(new Array<boolean>(selectedRecyclables.length));
    setSelectedDonatables(new Array<boolean>(selectedDonatables.length));
    setSelectedEwaste(new Array<boolean>(selectedEwaste.length));
    recyclableConditions.fill(false);
    donatableConditions.fill("");
    ewasteConditions.fill("");
  };

  return (
    // Base param: bgiAbsolutePath={stage != 3 ? "/src/images/test.jpeg" : undefined}
    <Base>
      {stage == 1 ? (
        <QueryForm
          setStage={setStage}
          selectedRecyclables={selectedRecyclables}
          selectedDonatables={selectedDonatables}
          selectedEwaste={selectedEwaste}
          setSelectedRecyclables={setSelectedRecyclables}
          setSelectedDonatables={setSelectedDonatables}
          setSelectedEwaste={setSelectedEwaste}
          numSelectedItems={numSelectedItems}
          setNumSelectedItems={setNumSelectedItems}
          clearForm={clearForm}
        />
      ) : stage == 2 ? (
        <ChecklistForm
          setStage={setStage}
          selectedRecyclables={selectedRecyclables}
          selectedDonatables={selectedDonatables}
          selectedEwaste={selectedEwaste}
          recyclableConditions={recyclableConditions}
          setRecyclableConditions={setRecyclableConditions}
          donatableConditions={donatableConditions}
          setDonatableConditions={setDonatableConditions}
          ewasteConditions={ewasteConditions}
          setEwasteConditions={setEwasteConditions}
        />
      ) : (
        <ResultsPage
          setStage={setStage}
          selectedRecyclables={selectedRecyclables}
          selectedDonatables={selectedDonatables}
          selectedEwaste={selectedEwaste}
          recyclableConditions={recyclableConditions}
          donatableConditions={donatableConditions}
          ewasteConditions={ewasteConditions}
          clearForm={clearForm}
        />
      )}
    </Base>
  );
}

export default HomePage;
