import { Icon } from "../../lib/types";

export function TelevisionIcon({ size = 14, ...rest }: Icon) {
 return (
  <img
   src="/img/television.png"
   height={size}
   width={size}
   {...rest}
   alt="Television"
   className="room--icon"
  />
 );
}
