import { Icon } from "../../lib/types";

export function IroningBoardIcon({ size = 14, ...rest }: Icon) {
 return (
  <img
   src="/img/ironing-board.png"
   height={size}
   width={size}
   {...rest}
   alt="Ironing board"
   className="room--icon"
  />
 );
}
