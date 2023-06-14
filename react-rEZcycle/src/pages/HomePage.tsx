import { useEffect, useState } from "react";
import Base from "../components/Base";
import QueryPage from "../components/QueryPage";
import ChecklistPage from "../components/ChecklistPage";

function HomePage() {
  const [selectedItems, setSelectedItems] = useState<boolean[][]>([
    new Array<boolean>(26).fill(false),
    new Array<boolean>(9).fill(false),
    new Array<boolean>(6).fill(false),
  ]);
  const [stage, setStage] = useState(1);

  return (
    <Base>
      {stage == 1 ? (
        <QueryPage
          stage={stage}
          setStage={setStage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : (
        <ChecklistPage
          stage={stage}
          setStage={setStage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}
    </Base>
  );
}

export default HomePage;
