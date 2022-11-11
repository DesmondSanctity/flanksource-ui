import { useQuery } from "@tanstack/react-query";
import { getAllConfigsMatchingQuery } from "../services/configs";
import { getIncident } from "../services/incident";
import {
  getTopology,
  getTopologyComponentLabels,
  getTopologyComponents
} from "../services/topology";

const cache: Record<string, any> = {};

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

export const useComponentLabelsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(["alllabels"], getTopologyComponentLabels, {
    staleTime,
    enabled,
    ...rest
  });
};

export const useComponentNameQuery = (
  topologyId = "",
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  return useQuery(
    ["topology", topologyId],
    () => {
      return getTopology({
        id: topologyId
      }).then((data) => {
        cache[topologyId] = data.data[0];
        return data.data[0];
      });
    },
    {
      staleTime,
      enabled,
      placeholderData: () => {
        return cache[topologyId];
      },
      ...rest
    }
  );
};

export const useAllConfigsQuery = (
  query: string,
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  return useQuery(
    ["allConfigs"],
    () => {
      return getAllConfigsMatchingQuery(query);
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};
