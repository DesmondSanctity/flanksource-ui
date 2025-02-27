import clsx from "clsx";
import { useState } from "react";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  options: string[];
  className?: string;
} & Omit<React.DetailsHTMLAttributes<HTMLDivElement>, "onChange">;

export function Switch({
  onChange = () => {},
  options,
  value,
  className,
  ...props
}: Props) {
  const [activeOption, setActiveOption] = useState(() => value || options[0]);
  const activeClasses =
    "p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium bg-white shadow-sm ring-1 ring-black ring-opacity-5";
  const inActiveClasses =
    "p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium";

  function handleClick(view: string) {
    onChange(view);
    setActiveOption(view);
  }

  return (
    <div
      className={clsx(
        "group p-0.5 rounded-lg flex bg-gray-100 hover:bg-gray-200",
        className
      )}
      {...props}
    >
      {options.map((option) => {
        return (
          <button
            type="button"
            className="rounded-md flex-1 items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100"
            tabIndex={0}
            onClick={(e) => handleClick(option)}
            key={option}
          >
            <span
              className={
                activeOption === option ? activeClasses : inActiveClasses
              }
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
