import { IncidentCommander } from "../axios";
import { Hypothesis } from "./hypothesis";
import { Incident } from "./incident";
import { User } from "./users";

// expand this list to add more items
export type IncidentHistoryType =
  | "evidence.created"
  | "incident.created"
  | "responder.created"
  | "incident_status.updated";

export interface IncidentHistory {
  id: string;
  incident_id: string;
  created_by: Pick<User, "id" | "name" | "avatar">;
  type: IncidentHistoryType;
  description: string;
  hypothesis_id?: string;
  created_at: string;
  updated_at: string;
  hypotheses?: Hypothesis[];
  incidents: Incident[];
}

export const getIncidentHistory = async (incidentID: string) => {
  const res = await IncidentCommander.get<IncidentHistory[]>(
    `/incident_histories?incident_id=eq.${incidentID}&select=created_at,type,description,created_by(id,name,avatar))&order=created_at.desc`
  );
  return res.data;
};
