import clsx from "clsx";
import { size } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useIncidentQuery } from "../../../api/query-hooks";
import { Evidence, updateEvidence } from "../../../api/services/evidence";
import { Hypothesis } from "../../../api/services/hypothesis";
import { IncidentStatus, updateIncident } from "../../../api/services/incident";
import { statusItems } from "../../Incidents/data";
import { Modal } from "../../Modal";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import { toastError, toastSuccess } from "../../Toast/toast";
import { EvidenceView } from "../DefinitionOfDone/EvidenceView";

type IncidentWorkflowProps = {
  name: string;
  label: string;
  control: any;
  className: string;
  incidentId: string;
};

const statusesForWhichFactorsNeeedToBeCaptured = [
  IncidentStatus.Mitigated,
  IncidentStatus.Resolved
];

export function IncidentWorkflow({
  name,
  label,
  control,
  className = "w-full",
  incidentId
}: IncidentWorkflowProps) {
  const [statusToUpdate, setStatusToUpdate] = useState<{
    val: IncidentStatus;
    changeFn: (val: IncidentStatus) => void;
  }>();
  const [addToDODModalOpen, setAddToDODModalOpen] = useState(false);
  const [selectedEvidences, setSelectedEvidences] = useState<Evidence[]>([]);
  const [nonDODEvidences, setNonDODEvidences] = useState<Evidence[]>([]);
  const incidentQuery = useIncidentQuery(incidentId);
  const incidentData = useMemo(() => incidentQuery.data, [incidentQuery.data]);

  const incident = useMemo(
    () => (incidentData?.length ? incidentData[0] : null),
    [incidentData]
  );

  useEffect(() => {
    if (!incident) {
      setNonDODEvidences([]);
      return;
    }
    const data: Evidence[] = [];
    incident.hypotheses.forEach((hypothesis: Hypothesis) => {
      hypothesis?.evidences?.forEach((evidence: Evidence) => {
        data.push(evidence);
      });
    });
    setNonDODEvidences(data.filter((evidence) => !evidence.definition_of_done));
  }, [incident]);

  const handleIncidentWorkflow = async (
    status: IncidentStatus,
    changeFn: any
  ) => {
    if (
      statusesForWhichFactorsNeeedToBeCaptured.includes(status) &&
      nonDODEvidences.length
    ) {
      setAddToDODModalOpen(true);
      setStatusToUpdate({
        val: status,
        changeFn
      });
      return;
    }
    await udpateIncidentStatus(status);
    changeFn(status);
  };

  const udpateIncidentStatus = async (status: IncidentStatus) => {
    try {
      await updateIncident(incidentId, { status });
      toastSuccess(`Incident status updated successfully`);
    } catch (ex) {
      toastSuccess(`Incident status updated failed`);
    }
  };

  const isSelected = (id: string) => {
    return !!selectedEvidences.find((item) => item.id === id);
  };

  const addSelectedEvidencesToDOD = async () => {
    if (!selectedEvidences.length) {
      toastError(`Please select atleast one evidence`);
      return;
    }
    for (const element of selectedEvidences) {
      try {
        await updateEvidence(element.id, {
          definition_of_done: true
        });
      } catch (ex) {}
    }
    await udpateIncidentStatus(statusToUpdate?.val!);
    statusToUpdate?.changeFn(statusToUpdate?.val!);
    setStatusToUpdate(undefined);
    resetModalState();
  };

  const skip = async () => {
    await udpateIncidentStatus(statusToUpdate?.val!);
    statusToUpdate?.changeFn(statusToUpdate?.val!);
    setStatusToUpdate(undefined);
    resetModalState();
  };

  const resetModalState = () => {
    setAddToDODModalOpen(false);
    setSelectedEvidences([]);
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { isDirty } }) => {
          const { onChange, value } = field;
          return (
            <ReactSelectDropdown
              label={label}
              name={name}
              className={className}
              items={statusItems}
              value={value}
              onChange={(value) => {
                handleIncidentWorkflow(value as IncidentStatus, onChange);
              }}
            />
          );
        }}
      />
      <Modal
        title="Add contributing factors and mitigating factors to definition of done before updating status"
        onClose={() => {
          resetModalState();
        }}
        open={addToDODModalOpen}
        bodyClass=""
      >
        <div
          style={{ maxHeight: "calc(100vh - 6rem)" }}
          className="overflow-y-auto overflow-x-hidden divide-y divide-gray-200 mb-20"
        >
          {nonDODEvidences.map((evidence, index) => {
            return (
              <div key={index} className="relative flex items-center p-6">
                <div className="min-w-0 flex-1 text-sm mr-4">
                  <EvidenceView evidence={evidence} size={size} />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={isSelected(evidence.id)}
                    onChange={(e) => {
                      setSelectedEvidences((val) => {
                        if (val.includes(evidence)) {
                          return val.filter((v) => v.id !== evidence.id);
                        } else {
                          return [...val, evidence];
                        }
                      });
                    }}
                  />
                </div>
              </div>
            );
          })}
          {!Boolean(nonDODEvidences.length) && (
            <div className="flex items-center justify-center py-5 px-5 h-56">
              <div className="text-sm text-gray-500">
                There are no evidences which are not part of defintion of done
              </div>
            </div>
          )}
        </div>
        <div
          className={clsx(
            "flex rounded-t-lg justify-between bg-gray-100 px-8 pb-4 items-end",
            "absolute w-full bottom-0 left-0"
          )}
        >
          <div className="flex flex-1">
            <button
              type="button"
              className={clsx("btn-secondary-base btn-secondary", "mt-4")}
              onClick={() => {
                resetModalState();
              }}
            >
              Cancel
            </button>
          </div>
          {Boolean(nonDODEvidences.length) && (
            <div className="flex flex-1 justify-end">
              <button
                type="button"
                className={clsx(
                  "btn-secondary-base btn-secondary",
                  "mt-4 mr-4"
                )}
                onClick={() => {
                  skip();
                }}
              >
                Skip
              </button>
              <button
                type="submit"
                className={clsx("btn-primary", "mt-4")}
                onClick={() => {
                  setAddToDODModalOpen(false);
                  addSelectedEvidencesToDOD();
                }}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
