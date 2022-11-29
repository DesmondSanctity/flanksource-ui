import { Dispatch, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { DefinitionOfDoneAction, DefinitionOfDoneState } from "..";
import { Evidence } from "../../../../api/services/evidence";
import { CodeEditor } from "../../../CodeEditor";

type Props = {
  state: DefinitionOfDoneState;
  onSelect: Dispatch<DefinitionOfDoneAction>;
  nonDODEvidences: Evidence[];
};

type DefinitionOfDoneAddScriptForm = {
  script?: string;
};

export function DefinitionOfDoneAddScript({
  state,
  onSelect,
  nonDODEvidences
}: Props) {
  const selectedEvidence = useMemo(
    () =>
      nonDODEvidences.filter((evidence) => evidence.id === state.item?.id)[0],
    [nonDODEvidences, state.item?.id]
  );

  const { control, handleSubmit } = useForm<DefinitionOfDoneAddScriptForm>({
    mode: "onBlur",
    defaultValues: {
      script: undefined
    }
  });

  const onSubmit = async (data: DefinitionOfDoneAddScriptForm) => {
    onSelect({
      type: "addScript",
      value: data.script
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4">
        <div className="font-semibold">Selected Evidence</div>
        <div className="text-gray-500">{selectedEvidence?.description}</div>
        <div className="font-semibold">Script (Optional)</div>
        <div className="flex flex-col w-full h-[min(300px,calc(100vh-500px))]">
          <Controller
            name="script"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CodeEditor value={value ?? ""} onChange={onChange} />
            )}
          />
        </div>
        <div className="flex flex-row justify-end">
          <button className="px-4 py-2 btn-primary" type="submit">
            Add definition of done
          </button>
        </div>
      </div>
    </form>
  );
}
