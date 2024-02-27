import { MultiReviewData } from "@/types/server.types";
import SingleStarRate from "../atoms/SingleStarRate";
import Image from "next/image";
import NoImg from "@/public/images/no_image.webp";
import calcData from "@/utils/calcDate";
import ReviewCardTag from "../atoms/ReviewCardTag";
import Link from "next/link";
interface Props {
  review: MultiReviewData;
}

export default function ReviewCard({ review }: Props) {
  const { title, stars, nickName, reviewId, tagValues, image, visitingTime } = review;
  const { tagMonth } = calcData(visitingTime);

  return (
    <Link
      href={`/review/${reviewId}`}
      className="shadow-main rounded-10 tablet:w-282 tablet:h-330 w-155 h-205 tablet:p-8 flex flex-col items-center flex-shrink-0 p-4 bg-white select-none"
    >
      <div className="h-240 relative w-full overflow-hidden">
        <Image
          src={image ?? NoImg}
          alt="카드 이미지"
          draggable={false}
          fill
          style={{
            objectFit: "cover",
          }}
          className="rounded-10"
        />
      </div>
      <div className="grid w-full grid-cols-[auto_3.7rem] grid-rows-[2rem_2rem_2rem] p-4 pb-6 tablet:grid-rows-[2.8rem_2.6rem] tablet:grid-cols-[auto_4.8rem] tablet:gap-x-14 tablet:gap-y-8 items-center">
        <h3 className="text-14 leading-20 text-ellipsis whitespace-nowrap tablet:heading6 tablet:col-span-1 col-span-2 overflow-hidden font-bold">
          {title}
        </h3>
        <div className="text-10 leading-20 text-ellipsis whitespace-nowrap tablet:small-text overflow-hidden">
          <span>by {nickName}</span>
        </div>
        <div className="tablet:col-span-1 flex col-span-2 gap-4">
          <div className="text-10 bg-gray-10 flex-center tablet:small-text tablet:w-43 tablet:py-4 w-32 rounded-full">
            {tagMonth}
          </div>
          {tagValues &&
            Object.entries(tagValues).map(([key, value]: [string, string]) => (
              <ReviewCardTag value={value} key={key + reviewId} />
            ))}
        </div>
        <div className="flex justify-end col-start-2 row-start-2">
          <SingleStarRate rate={stars} />
        </div>
      </div>
    </Link>
  );
}
