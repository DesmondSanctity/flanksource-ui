import { useQuery } from "@tanstack/react-query";
import { getAllConfigs } from "../services/configs";
import { getIncident } from "../services/incident";
import { getTopologyComponents } from "../services/topology";

const defaultStaleTime = 1000 * 60 * 5;

export const createIncidentQueryKey = (id: string) => ["getIncident", id];

export const useIncidentQuery = (id = "") => {
  return useQuery(createIncidentQueryKey(id), () =>
    getIncident(id).then((response) => response.data)
  );
};

export const useComponentsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(["allcomponents"], getTopologyComponents, {
    staleTime,
    enabled,
    ...rest
  });
};

export const useAllConfigsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(["allConfigs"], getAllConfigs, {
    staleTime,
    enabled,
    ...rest
  });
};
