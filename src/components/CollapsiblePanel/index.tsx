import { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { VerticalSCrollView } from "../VerticalScrollView/VerticalScrollView";

type Props = {
  Header: React.ReactNode;
  children: React.ReactNode;
  isClosed?: boolean;
  maxContentHeight?: string;
};

export default function CollapsiblePanel({
  Header,
  children,
  maxContentHeight = "150px",
  isClosed = false
}: Props) {
  const [isOpen, setIsOpen] = useState(!isClosed);

  return (
    <div className="flex flex-col">
      <div
        // onClick={() => setIsOpen(!isOpen)}   disabled to allow other icon perform onclick without opening/closing the panel
        className={`flex flex-row py-2 cursor-pointer items-center justify-center ${
          isOpen && "border-b border-dashed border-gray-200"
        }`}
      >
        <div className="flex flex-row flex-1 items-center">{Header}</div>
        <div
          className="flex flex-col items-center justify-center space-y-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <IoChevronUpOutline size={20} />
          ) : (
            <IoChevronDownOutline size={20} />
          )}
        </div>
      </div>
      <div
        className={`flex flex-col transform origin-bottom duration-500 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <VerticalSCrollView className="w-full" maxHeight={maxContentHeight}>
          {children}
        </VerticalSCrollView>
      </div>
    </div>
  );
}
