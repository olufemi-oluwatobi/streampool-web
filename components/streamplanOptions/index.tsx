import { Checkbox } from "antd";
import { StreamPlan } from "@providers/streamServiceProvider";

const TEMP_COMMISSION_CHARGE = 200;
const StreamOptions = ({
  plan,
  onSelectPlan,
  isSelected,
}: {
  plan: StreamPlan;
  onSelectPlan: (plan: StreamPlan) => void;
  isSelected: boolean;
}) => {
  return (
    <div className="w-full rounded-md flex justify-between items-center px-4 py-2 mb-4 border-[#494949] border-solid border ">
      <div className="flex flex-col items-start justify-start  ">
        <span className=" text-base font-bold text-white-200 ">
          {plan.name}
        </span>
        <span className=" text-md text-gray-300 ">
          {plan.currency}{" "}
          {Number(
            parseInt(plan.amount, 10) + TEMP_COMMISSION_CHARGE
          )?.toLocaleString()}{" "}
          - {plan.max_limit} members
        </span>
      </div>
      <Checkbox checked={isSelected} onClick={() => onSelectPlan(plan)} />
    </div>
  );
};

export default StreamOptions;
