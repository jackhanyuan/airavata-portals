import {Tooltip} from "@/components/ui/tooltip.tsx";
import {IoEyeOffOutline} from "react-icons/io5";

export const PrivateResourceTooltip = () => {
  return (
      <Tooltip content={"This resource is private and can only be seen by the resource's authors"}>
        <IoEyeOffOutline/>
      </Tooltip>
  )
}