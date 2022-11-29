import { useEffect, useMemo, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsHourglassSplit, BsTrash } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import { RiFullscreenLine } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { useIncidentQuery } from "../../../api/query-hooks";
import { Evidence, updateEvidence } from "../../../api/services/evidence";
import { Hypothesis } from "../../../api/services/hypothesis";
import { Size } from "../../../types";
import { searchParamsToObj } from "../../../utils/common";
import { DeleteConfirmDialog } from "../../DeleteConfirmDialog";
import { EvidenceItem } from "../../Hypothesis/EvidenceSection";
import { IconButton } from "../../IconButton";
import { Menu } from "../../Menu";
import { Modal } from "../../Modal";
import { EvidenceView } from "./EvidenceView";
import { AddDefinitionOfDone } from "../AddDefinitionOfDone";

type DefinitionOfDoneProps = {
  incidentId: string;
};

function AddDefinitionOfDoneButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <button
        type="button"
        className="flex items-center bg-white rounded-md group"
        onClick={onClick}
      >
        <span className="flex items-center justify-center w-5 h-5 text-gray-400 border-2 border-gray-300 border-dashed rounded-full">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
        <span className="ml-2 text-sm font-medium text-blue-600 group-hover:text-blue-500">
          Add definition of done
        </span>
      </button>
    </div>
  );
}

export function DefinitionOfDone({ incidentId }: DefinitionOfDoneProps) {
  const size = Size.small;
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [evidenceBeingRemoved, setEvidenceBeingRemoved] = useState<Evidence>();
  const [dodEvidences, setDODEvidences] = useState<Evidence[]>([]);
  const [dodModalOpen, setDODModalOpen] = useState(false);
  const [addToDODModalOpen, setAddToDODModalOpen] = useState(false);
  const [nonDODEvidences, setNonDODEvidences] = useState<Evidence[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshEvidencesToken, setRefreshEvidencesToken] = useState<
    string | null
  >(null);
  const incidentQuery = useIncidentQuery(incidentId);
  const { refetch, isRefetching, isLoading } = incidentQuery;

  const incidentData = useMemo(() => incidentQuery.data, [incidentQuery.data]);

  const incident = useMemo(
    () => (incidentData?.length ? incidentData[0] : null),
    [incidentData]
  );

  useEffect(() => {
    if (!incident) {
      setDODEvidences([]);
      return;
    }
    const data: Evidence[] = [];
    incident.hypotheses.forEach((hypothesis: Hypothesis) => {
      hypothesis?.evidences?.forEach((evidence: Evidence) => {
        data.push(evidence);
      });
    });
    setNonDODEvidences(data.filter((evidence) => !evidence.definition_of_done));
    setDODEvidences(data.filter((evidence) => evidence.definition_of_done));
  }, [incident]);

  useEffect(() => {
    if (
      searchParams.get("refresh_evidences") === refreshEvidencesToken &&
      refreshEvidencesToken
    ) {
      return;
    }
    refetch();
  }, [refreshEvidencesToken, refetch, searchParams]);

  const initiateDeleteEvidenceFromDOD = async () => {
    if (!evidenceBeingRemoved) {
      return;
    }
    setOpenDeleteConfirmDialog(false);
    await removeEvidenceFromDOD(evidenceBeingRemoved);
  };

  const removeEvidenceFromDOD = (evidence: Evidence) => {
    return updateEvidence(evidence.id, {
      definition_of_done: false
    }).then(() => {
      dodEvidences.forEach((item) => {
        if (evidence.id === item.id) {
          evidence.definition_of_done = false;
          setNonDODEvidences([...nonDODEvidences, evidence]);
        }
      });
      setDODEvidences([
        ...dodEvidences.filter((item) => item.definition_of_done)
      ]);
      assignNewEvidencesRefreshToken();
    });
  };

  const assignNewEvidencesRefreshToken = () => {
    const token = (+new Date()).toString();
    setRefreshEvidencesToken(token);
    setSearchParams({
      ...searchParamsToObj(searchParams),
      refresh_evidences: token
    });
  };

  return (
    <div className="w-full">
      <div className="py-4 border-b border-gray-200 mb-4">
        <div className="px-4 flex justify-between">
          <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
            Definition of Done
          </h2>
          <span className="relative z-0 inline-flex">
            <MdRefresh
              className="cursor-pointer mr-3 w-6 h-6"
              onClick={() => refetch()}
            />
            <RiFullscreenLine
              className="cursor-pointer w-5 h-5"
              onClick={() => setDODModalOpen(true)}
            />
          </span>
        </div>
      </div>
      <div className="flex max-h-96 overflow-y-auto overflow-x-hidden w-full px-4">
        <div className="w-full">
          {(isLoading || isRefetching) && (
            <div className="flex items-start py-2 pl-2 pr-2">
              <div className="text-sm text-gray-500">
                Loading evidences please wait...
              </div>
            </div>
          )}
          {!(isLoading || isRefetching) &&
            dodEvidences.map((evidence, index) => {
              return (
                <div key={index} className="relative flex items-center py-2">
                  {evidence.done ? (
                    <AiFillCheckCircle className="mr-1" />
                  ) : (
                    <BsHourglassSplit className="mr-1" />
                  )}
                  <div className="min-w-0 flex-1 text-sm">
                    <EvidenceView evidence={evidence} size={size} />
                  </div>
                  <div className="flex items-center">
                    <Menu>
                      <Menu.VerticalIconButton />
                      <Menu.Items widthClass="w-72">
                        <Menu.Item
                          onClick={(e: any) => {
                            setOpenDeleteConfirmDialog(true);
                            setEvidenceBeingRemoved(evidence);
                          }}
                        >
                          <div className="cursor-pointer flex w-full">
                            <IconButton
                              className="bg-transparent flex items-center"
                              ovalProps={{
                                stroke: "blue",
                                height: "18px",
                                width: "18px",
                                fill: "transparent"
                              }}
                              icon={
                                <BsTrash
                                  className="text-gray-600 border-0 border-l-1 border-gray-200"
                                  size={18}
                                />
                              }
                            />
                            <span className="pl-2 text-sm block cursor-pionter">
                              Remove from Definition of done
                            </span>
                          </div>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              );
            })}
          <AddDefinitionOfDoneButton
            onClick={() => {
              setAddToDODModalOpen(true);
            }}
          />
        </div>
      </div>
      <DeleteConfirmDialog
        isOpen={openDeleteConfirmDialog}
        title="Remove from definition of done ?"
        description="Are you sure you want to remove the evidence from definition of done ?"
        deleteLabel="Remove"
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onDelete={() => {
          initiateDeleteEvidenceFromDOD();
        }}
      />
      <Modal
        title="Definition of Done"
        onClose={() => {
          setDODModalOpen(false);
        }}
        open={dodModalOpen}
        bodyClass=""
      >
        <div
          style={{ maxHeight: "calc(100vh - 6rem)" }}
          className="py-4 px-8 overflow-y-auto overflow-x-hidden divide-y divide-gray-200"
        >
          {dodEvidences.map((evidence, index) => {
            return (
              <div key={index} className="py-6">
                <EvidenceItem evidence={evidence} />
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        title="Add to Definition of done"
        onClose={() => {
          setAddToDODModalOpen(false);
        }}
        open={addToDODModalOpen}
        bodyClass=""
      >
        <div className="w-full flex flex-col p-6 bg-gray-100">
          {nonDODEvidences.length > 0 ? (
            <AddDefinitionOfDone
              nonDODEvidences={nonDODEvidences}
              onAddDefinitionOfDone={(evidence) => {
                setAddToDODModalOpen(false);
                setDODEvidences([...dodEvidences, evidence]);
                setNonDODEvidences(
                  nonDODEvidences.filter((v) => v.id !== evidence.id)
                );
              }}
            />
          ) : (
            <div className="flex items-center justify-center py-5 px-5 h-56">
              <div className="text-sm text-gray-500">
                There are no evidences which are not part of definition of done
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
