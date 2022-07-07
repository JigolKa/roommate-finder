import { Icon } from "../../lib/types";

export function DryerIcon({ size = 14, ...rest }: Icon) {
 return (
  <img
   src="/img/dryer.png"
   height={size}
   width={size}
   {...rest}
   alt="Dryer"
   className="room--icon"
  />
 );
}
