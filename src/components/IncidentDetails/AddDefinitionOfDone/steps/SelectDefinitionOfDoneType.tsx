import { Dispatch, useMemo } from "react";
import { DefinitionOfDoneAction, DefinitionOfDoneType } from "..";
import { Evidence } from "../../../../api/services/evidence";

type SelectDefinitionOfDoneTypeProps = {
  onSelect: Dispatch<DefinitionOfDoneAction>;
  nonDODEvidences: Evidence[];
};

const definitionOfDoneEvidenceTypes: [DefinitionOfDoneType, string][] = [
  ["log", "Logs Evidence"],
  ["config", "Config Evidence"],
  ["check", "Health Evidence"],
  ["topology", "Topology Evidence"],
  ["config_analysis", "Config Analysis Evidence"],
  ["config_change", "Config Change Evidence"]
];

export function SelectDefinitionOfDoneType({
  onSelect,
  nonDODEvidences
}: SelectDefinitionOfDoneTypeProps) {
  // remove definition of done evidences from the list that can't be selected
  const filteredDefinitionOfDoneEvidenceTypes = useMemo(
    () =>
      definitionOfDoneEvidenceTypes.filter(([type]) =>
        nonDODEvidences.find((evidence) => evidence.type === type)
      ),
    [nonDODEvidences]
  );

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full flex flex-col space-y-2">
        {filteredDefinitionOfDoneEvidenceTypes.map(([type, label]) => (
          <button
            key={type}
            onClick={() =>
              onSelect({
                type: "typeOfDefinitionOfDone",
                value: type as DefinitionOfDoneType
              })
            }
            className="w-full py-2 px-4 btn btn-primary cursor-pointer rounded-md"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
