import { useState } from "react";
import { IoChevronBackCircle } from "react-icons/io5";

export function Sidebar({
  animated = false,
  settings,
  flipped = false,
  ...rest
}) {
  const { children, className } = rest;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`border border-gray-200 h-screen sticky top-0 ${
        collapsed ? "border-l-0" : ""
      }`}
    >
      <button
        title={`${collapsed ? "Show" : "Hide"} sidebar`}
        className={`z-10 transform absolute top-5 
          ${flipped ? "-right-3" : "-left-3"} 
          ${collapsed === flipped ? "rotate-180" : ""}
        `}
        type="button"
        onClick={() => setCollapsed(!collapsed)}
      >
        <IoChevronBackCircle className="h-6 w-6 text-gray-500" />
      </button>
      <div
        className={`flex-shrink-0 bg-gray-50 h-full overflow-x-hidden overflow-y-auto ${
          animated ? "transform duration-200" : ""
        } ${className || ""}`}
        style={{ width: collapsed ? "0" : "310px" }}
      >
        <div className="p-4" style={{ minWidth: animated ? "300px" : "" }}>
          {!collapsed && children}
        </div>
      </div>
    </div>
  );
}
