import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import {
  useNavigate,
  useSearchParams,
  useOutletContext
} from "react-router-dom";
import { filterConfigsByText } from "../../components/ConfigViewer/utils";
import { BreadcrumbNav } from "../../components/BreadcrumbNav";
import { TextInputClearable } from "../../components/TextInputClearable";
import ConfigList from "../../components/ConfigList";
import { SearchSelectTag } from "../../components/SearchSelectTag";
import { QueryBuilder } from "../../components/QueryBuilder";
import { Switch } from "../../components/Switch";
import { RefreshButton } from "../../components/RefreshButton";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { ReactSelectDropdown } from "../../components/ReactSelectDropdown";
import { useAllConfigsQuery } from "../../api/query-hooks";

const ConfigFilterViewTypes = {
  basic: "Basic",
  advanced: "Advanced"
};

export function ConfigListPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    configState: { data, filteredData },
    setConfigState
  } = useConfigPageContext();
  const { setTitle, setTitleExtras } = useOutletContext<any>();
  const [configFilterView, setConfigFilterView] = useState(
    params.get("query")
      ? ConfigFilterViewTypes.advanced
      : ConfigFilterViewTypes.basic
  );
  const options = useMemo(() => {
    return [ConfigFilterViewTypes.basic, ConfigFilterViewTypes.advanced];
  }, []);

  const configTagItems: any = useMemo(() => {
    if (!data) return [];
    data.flatMap((d) => {
      return Object.entries(d?.tags || {});
    });
  }, [data]);

  const {
    data: allConfigs,
    isLoading,
    isRefetching,
    refetch: refetchLogs
  } = useAllConfigsQuery({});

  const search = params.get("search");
  const tag = decodeURIComponent(params.get("tag") || "All");
  const configType = decodeURIComponent(params.get("type") || "All");

  useEffect(() => {
    if (params.get("query")) {
      return;
    }
    if (!allConfigs?.data) {
      return;
    }
    setConfigState((state) => {
      return {
        ...state,
        data: allConfigs.data
      };
    });
  }, [configFilterView, params, allConfigs]);

  const loading = useMemo(() => {
    return isLoading || isRefetching;
  }, [isLoading, isRefetching]);

  const handleRowClick = (row?: { original?: { id: string } }) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/configs/${id}`);
    }
  };

  const extra = (
    <div className="flex space-x-2 mr-4">
      {configFilterView === ConfigFilterViewTypes.advanced && (
        /* @ts-expect-error */
        <QueryBuilder
          refreshConfigs={(e: any) => {
            setConfigState((state) => {
              return {
                ...state,
                data: e
              };
            });
          }}
        />
      )}

      {configFilterView === ConfigFilterViewTypes.basic && (
        <>
          <RefreshButton onClick={() => refetchLogs()} animate={loading} />
          <TypeDropdown
            value={configType}
            onChange={(ct: any) => {
              params.set("type", encodeURIComponent(ct || ""));
              setParams(params);
            }}
          />

          <span className="w-80">
            <SearchSelectTag
              tags={configTagItems}
              value={tag}
              onChange={(ct) => {
                params.set("tag", encodeURIComponent(ct.value || ""));
                setParams(params);
              }}
            />
          </span>

          {/* @ts-expect-error */}
          <TextInputClearable
            onChange={debounce((e) => {
              const query = e.target.value || "";
              params.set("search", query);
              setParams(params);
            }, 200)}
            className="w-80"
            placeholder="Search for configs"
            defaultValue={params.get("search")}
          />
        </>
      )}

      {/* @ts-expect-error */}
      <Switch
        onChange={(e: string) => {
          setConfigFilterView(e);
          setParams({});
        }}
        options={options}
        value={configFilterView}
      />
    </div>
  );

  useEffect(() => {
    setTitleExtras(extra);
    return () => setTitleExtras(null);
  }, [
    data,
    configType,
    tag,
    search,
    configTagItems,
    options,
    configFilterView,
    loading
  ]);

  useEffect(() => {
    let filteredData = data;
    setTitle(<BreadcrumbNav list={["Config"]} />);
    if (data?.length! > 0) {
      // do filtering here
      filteredData = filterConfigsByText(filteredData, search);

      if (configType && configType !== "All") {
        filteredData = filteredData!.filter(
          (d) => configType === d.config_type
        );
      }

      if (tag && tag !== "All") {
        filteredData = filteredData!.filter((d) => {
          if (Array.isArray(tag)) {
            const kvs = tag.map((x) => x.split("__:__"));
            return kvs.some(([key, val]) => d.tags[key] === val);
          } else {
            const [k, v] = tag.split("__:__");
            return d.tags[k] === v;
          }
        });
      }
    }
    setConfigState((state) => {
      return {
        ...state,
        filteredData
      };
    });
    // setFilteredData(filteredData);
  }, [data, search, configType, tag]);

  return (
    <ConfigList
      data={filteredData!}
      handleRowClick={handleRowClick}
      isLoading={loading}
    />
  );
}

const TypeDropdown = ({ ...rest }) => {
  const items = {
    All: {
      id: "All",
      name: "All",
      description: "All",
      value: "All"
    },
    EC2Instance: {
      id: "EC2Instance",
      name: "EC2 Instance",
      description: "EC2 Instance",
      value: "EC2Instance"
    },
    Subnet: {
      id: "Subnet",
      name: "Subnet",
      description: "Subnet",
      value: "Subnet"
    }
  };

  const [selected, setSelected] = useState<any>(Object.values(items)[0].value);

  return (
    <ReactSelectDropdown
      items={items}
      name="type"
      onChange={(value) => setSelected(value)}
      value={selected}
      className="w-64"
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
      {...rest}
    />
  );
};
