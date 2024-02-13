import StarFull from "@/public/images/icons/filled_star.svg";
import StarEmpty from "@/public/images/icons/empty_star.svg";
import halfStarImg from "@/public/images/icons/half_star.svg";
import Image from "next/image";
import { KeyboardEvent } from "react";
import { Stars } from "@/types/client.types";

interface Props {
  isChecked: boolean;
  rate: Stars;
  onClick: (num: number) => void;
  onMouseOver: (num: number) => void;
  onMouseOut: () => void;
  halfStar: boolean;
}

export default function Star({ isChecked, onClick, rate, onMouseOver, onMouseOut, halfStar }: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      onClick(rate);
    }
  };

  return (
    <>
      <button
        className={`${halfStar ? "overflow-hidden relative z-10" : "translate-x-[-1.4rem]"} w-14 h-28`}
        onMouseOver={() => {
          onMouseOver(rate);
        }}
        onKeyDown={handleKeyDown}
        onMouseOut={onMouseOut}
        onClick={() => {
          onClick(rate);
        }}
      >
        {isChecked ? (
          <Image src={StarEmpty} alt="빈 별" style={{ maxWidth: "100vw" }} />
        ) : halfStar ? (
          <Image src={halfStarImg} alt="반 별" style={{ maxWidth: "100vw" }} />
        ) : (
          <Image src={StarFull} alt="채워진 별" style={{ maxWidth: "100vw" }} />
        )}
      </button>
    </>
  );
}