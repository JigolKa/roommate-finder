import { Icon } from "../../lib/types";

export function HairDryerIcon({ size = 14, ...rest }: Icon) {
 return (
  <img
   src="/img/hair-dryer.svg"
   height={size}
   width={size}
   {...rest}
   alt="Hair dryer"
   className="room--icon"
  />
 );
}
