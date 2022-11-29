import { Dispatch, useMemo } from "react";
import { DefinitionOfDoneAction, DefinitionOfDoneState } from "..";
import { Evidence } from "../../../../api/services/evidence";
import { EvidenceView } from "../../DefinitionOfDone/EvidenceView";

type DefinitionOfDoneSelectEvidenceProps = {
  onSelect: Dispatch<DefinitionOfDoneAction>;
  nonDODEvidences: Evidence[];
  state: DefinitionOfDoneState;
};

export function DefinitionOfDoneSelectEvidence({
  onSelect,
  nonDODEvidences,
  state
}: DefinitionOfDoneSelectEvidenceProps) {
  const filteredEvidences = useMemo(() => {
    return nonDODEvidences.filter((evidence) => {
      return evidence.type === state.typeOfDefinitionOfDone;
    });
  }, [nonDODEvidences, state.typeOfDefinitionOfDone]);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full flex flex-col space-y-2">
        {filteredEvidences.length > 0 ? (
          nonDODEvidences.map((evidence) => (
            <div className="w-full flex flex-row space-x-2">
              <EvidenceView className="flex-1" evidence={evidence} />
              <div className="flex  items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  // checked={isSelected(evidence.id)}
                  onChange={() => {
                    onSelect({
                      ...state,
                      type: "selectedItem",
                      value: {
                        id: evidence.id
                      }
                    });
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No evidences found</p>
        )}
      </div>
    </div>
  );
}
