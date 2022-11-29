import React, { useEffect, useReducer } from "react";
import {
  Evidence,
  EvidenceType,
  updateEvidence
} from "../../../api/services/evidence";
import { Loading } from "../../Loading";
import { toastError } from "../../Toast/toast";
import { DefinitionOfDoneAddScript } from "./steps/DefinitionOfDoneAddScript";
import { DefinitionOfDoneSelectEvidence } from "./steps/DefinitionOfDoneSelectEvidence";
import { SelectDefinitionOfDoneType } from "./steps/SelectDefinitionOfDoneType";

export type DefinitionOfDoneType = `${EvidenceType}`;

type DefinitionOfDoneActionsStep1 = {
  type: "typeOfDefinitionOfDone";
  value: DefinitionOfDoneType;
};

type DefinitionOfDoneActionsStep2 = {
  type: "selectedItem";
  value: { id: string };
};

type DefinitionOfDoneActionsStep3 = {
  type: "addScript";
  value?: string;
};

type DefinitionOfDoneActionsReset = {
  type: "reset";
};

export type DefinitionOfDoneAction =
  | DefinitionOfDoneActionsStep1
  | DefinitionOfDoneActionsStep2
  | DefinitionOfDoneActionsStep3
  | DefinitionOfDoneActionsReset;

export type DefinitionOfDoneState = {
  nextStep: 0 | 1 | 2 | 3;
  typeOfDefinitionOfDone?: DefinitionOfDoneType;
  item?: { id: string };
  script?: string;
};

function addDefinitionOfDoneStepsReducer(
  state: DefinitionOfDoneState,
  action: DefinitionOfDoneAction
): DefinitionOfDoneState {
  switch (action.type) {
    case "typeOfDefinitionOfDone":
      return { ...state, nextStep: 1, typeOfDefinitionOfDone: action.value };

    case "selectedItem":
      return { ...state, nextStep: 2, item: action.value };

    case "addScript":
      return { ...state, nextStep: 3, script: action.value };

    case "reset":
      return {
        nextStep: 0
      };

    default:
      throw new Error();
  }
}

type AddDefinitionOfDoneWizardHeaderProps = {
  step: number;
  title: React.ReactNode;
  totalSteps: number;
};

function AddDefinitionOfDoneWizardHeader({
  step, // 0, 1, 2, 3
  title,
  totalSteps
}: AddDefinitionOfDoneWizardHeaderProps) {
  return (
    <div className="w-full flex flex-row space-y-2">
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex flex-row space-x-2 uppercase text-sm text-gray-500">
          Step {step} of 3
        </div>
        <h3 className="font-semibold uppercase text-sm text-gray-900">
          {title}
        </h3>
      </div>
      <div className="flex items-center w-1/3">
        <div className="w-full bg-white rounded-full mr-2">
          <div
            className="rounded-full bg-green-500 text-xs leading-none h-2 text-center text-white"
            style={{
              width: (parseInt(`${step}`) / totalSteps) * 100 + "%"
            }}
          ></div>
        </div>
        <div className="text-xs w-10 text-gray-600">
          {((step / totalSteps) * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

type AddDefinitionOfDoneProps = {
  nonDODEvidences: Evidence[];
  onAddDefinitionOfDone: (evidence: Evidence) => void;
};

export function AddDefinitionOfDone({
  nonDODEvidences,
  onAddDefinitionOfDone
}: AddDefinitionOfDoneProps) {
  const [steps, dispatch] = useReducer(addDefinitionOfDoneStepsReducer, {
    nextStep: 0
  });

  useEffect(() => {
    async function addDefinitionOfDone() {
      try {
        await updateEvidence(steps.item?.id!, {
          definition_of_done: true,
          ...(steps.script ? { script: steps.script } : {})
        });
        onAddDefinitionOfDone(
          nonDODEvidences.find((e) => e.id === steps.item?.id)!
        );
      } catch (ex: any) {
        toastError(ex.message);
      }
    }

    if (steps.nextStep === 3) {
      addDefinitionOfDone();
    }
  }, [nonDODEvidences, onAddDefinitionOfDone, steps]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col py-6">
        {steps.nextStep === 0 ? (
          <AddDefinitionOfDoneWizardHeader
            step={1}
            title="Select Type of Definition of Done"
            totalSteps={3}
          />
        ) : steps.nextStep === 1 ? (
          <AddDefinitionOfDoneWizardHeader
            step={2}
            title="Definition of done evidence"
            totalSteps={3}
          />
        ) : (
          <AddDefinitionOfDoneWizardHeader
            step={3}
            title="Definition of done script"
            totalSteps={3}
          />
        )}
      </div>
      <div className="w-full flex flex-col space-y-4 bg-white px-4 py-4 border border-gray-300 rounded-sm">
        {steps.nextStep === 0 && (
          <SelectDefinitionOfDoneType
            onSelect={dispatch}
            nonDODEvidences={nonDODEvidences}
          />
        )}
        {steps.nextStep === 1 && (
          <DefinitionOfDoneSelectEvidence
            onSelect={dispatch}
            nonDODEvidences={nonDODEvidences}
            state={steps}
          />
        )}
        {steps.nextStep === 2 && (
          <DefinitionOfDoneAddScript
            onSelect={dispatch}
            nonDODEvidences={nonDODEvidences}
            state={steps}
          />
        )}
        {steps.nextStep === 3 && <Loading text="Adding script" />}
      </div>
    </div>
  );
}
