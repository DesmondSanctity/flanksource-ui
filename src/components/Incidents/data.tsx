import { AiOutlineClose } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { RiLightbulbFill } from "react-icons/ri";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMinus
} from "react-icons/hi";
import { IncidentStatus } from "../../api/services/incident";
import { capitalizeFirstLetter } from "../../utils/common";

export const severityItems = {
  Low: {
    id: "dropdown-severity-low",
    icon: <HiOutlineChevronDoubleDown color="green" />,
    name: "Low",
    description: "Low",
    value: "Low"
  },
  Medium: {
    id: "dropdown-severity-medium",
    icon: <HiOutlineChevronDown color="green" />,
    name: "Medium",
    description: "Medium",
    value: "Medium"
  },
  High: {
    id: "dropdown-severity-high",
    icon: <HiOutlineMinus color="orange" />,
    name: "High",
    description: "High",
    value: "High"
  },
  Blocker: {
    id: "dropdown-severity-blocker",
    icon: <HiOutlineChevronUp color="red" />,
    name: "Blocker",
    description: "Blocker",
    value: "Blocker"
  },
  Critical: {
    id: "dropdown-severity-critical",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    name: "Critical",
    description: "Critical",
    value: "Critical"
  }
} as const;

export const statusItems = {
  [IncidentStatus.Open]: {
    id: `dropdown-status-${IncidentStatus.Open}`,
    icon: <RiLightbulbFill color="green" />,
    name: IncidentStatus.Open,
    description: capitalizeFirstLetter(IncidentStatus.Open),
    value: IncidentStatus.Open
  },
  [IncidentStatus.Closed]: {
    id: `dropdown-status-${IncidentStatus.Closed}`,
    icon: <AiOutlineClose color="gray" />,
    name: IncidentStatus.Closed,
    description: capitalizeFirstLetter(IncidentStatus.Closed),
    value: IncidentStatus.Closed
  },
  [IncidentStatus.New]: {
    id: `dropdown-status-${IncidentStatus.New}`,
    icon: <RiLightbulbFill color="green" />,
    name: IncidentStatus.New,
    description: capitalizeFirstLetter(IncidentStatus.New),
    value: IncidentStatus.New
  },
  [IncidentStatus.Mitigated]: {
    id: `dropdown-status-${IncidentStatus.Mitigated}`,
    icon: <RiLightbulbFill color="green" />,
    name: IncidentStatus.Mitigated,
    description: capitalizeFirstLetter(IncidentStatus.Mitigated),
    value: IncidentStatus.Mitigated
  },
  [IncidentStatus.Investigating]: {
    id: `dropdown-status-${IncidentStatus.Investigating}`,
    icon: <RiLightbulbFill color="green" />,
    name: IncidentStatus.Investigating,
    description: capitalizeFirstLetter(IncidentStatus.Investigating),
    value: IncidentStatus.Investigating
  },
  [IncidentStatus.Resolved]: {
    id: `dropdown-status-${IncidentStatus.Resolved}`,
    icon: <RiLightbulbFill color="green" />,
    name: IncidentStatus.Resolved,
    description: capitalizeFirstLetter(IncidentStatus.Resolved),
    value: IncidentStatus.Resolved
  }
} as const;

export const typeItems = {
  cost: {
    id: "dropdown-type-cost",
    name: "cost",
    icon: <BiDollarCircle />,
    description: "Cost",
    value: "cost"
  },
  availability: {
    id: "dropdown-type-availability",
    name: "availability",
    icon: <ImHeartBroken />,
    description: "Availability",
    value: "availability"
  },
  performance: {
    id: "dropdown-type-performance",
    name: "performance",
    icon: <IoMdSpeedometer />,
    description: "Performance",
    value: "performance"
  },
  security: {
    id: "dropdown-type-security",
    name: "security",
    icon: <MdSecurity />,
    description: "Security",
    value: "security"
  },
  integration: {
    id: "dropdown-type-integration",
    name: "integration",
    icon: <GrIntegration />,
    description: "Integration",
    value: "integration"
  },
  compliance: {
    id: "dropdown-type-compliance",
    name: "compliance",
    icon: <FaTasks />,
    description: "Compliance",
    value: "compliance"
  },
  technicalDebt: {
    id: "dropdown-type-technical-debt",
    name: "technicalDebt",
    icon: <GrWorkshop />,
    description: "Technical Debt",
    value: "technicalDebt"
  }
} as const;
