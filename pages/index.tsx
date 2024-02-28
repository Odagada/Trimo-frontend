import { useIntersectionObserver, useWindowSize } from "@uidotdev/usehooks";
import { TagWithMonth } from "@/types/client.types";
import Clickable from "@/components/atoms/Clickable";
import Footer from "@/components/atoms/Footer";
import MultiReviewCardSlider from "@/components/molecules/MultiReviewCardSlider";
import Nav from "@/components/molecules/NavigationBar";
import Emoji from "@/components/atoms/Emoji";
import PortalSearchBar from "@/components/molecules/PortalSearchBar";
import SearchBar from "@/components/atoms/Inputs/SearchBar";
import hero_sec from "@/public/images/hero-sec.png";
import quill from "@/public/icons/quill.webp";
import desktop from "@/public/images/desktopMock.png";
import mobile from "@/public/images/mobileMock.webp";
import desktopScreenShot1 from "@/public/images/DesktopScreenShot1.png";
import desktopScreenShot2 from "@/public/images/DesktopScreenShot2.png";
import Link from "next/link";
import Image from "next/image";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getReviewCardArray } from "@/apis/capsulesQuery";
import { useEffect, useState } from "react";
import { getAccessTokenFromCookie } from "@/utils/getAccessTokenFormCookie";
import { isLoggedIn } from "@/utils/validateByLoginStatus";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(getReviewCardArray("POPULAR"));
    await queryClient.prefetchQuery(getReviewCardArray("RECENT"));

    const accessToken = await getAccessTokenFromCookie(context);

    return {
      props: { dehydratedState: dehydrate(queryClient), isLoggedIn: isLoggedIn(accessToken) },
    };
  } catch {
    return { notFound: true };
  }
};

export default function Landing({ isLoggedIn }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Nav isLoggedIn={isLoggedIn} />

      <HeroSection />

      <CardSection />

      <TagSection />

      <ServiceExplainSection />

      <DeviceSection />

      <RightNowSection />

      <Footer />
    </>
  );
}

const HeroSection = () => {
  const [ref, entry] = useIntersectionObserver();
  const { width } = useWindowSize();

  return (
    <section className="px-24 pb-56 pt-36 tablet:pb-130 tablet:pt-88">
      <div className="relative mx-auto aspect-[914/275] max-w-914">
        <Image className="object-cover" draggable={false} fill src={hero_sec} alt="" />
      </div>
      <div id="heroSecSearchBar" className="mt-23 tablet:mt-55">
        <span ref={ref}></span>
        <PortalSearchBar switcher={width! <= 865 || entry?.isIntersecting}>
          <SearchBar size={width! <= 768 || entry?.isIntersecting ? "large" : "small"} />
        </PortalSearchBar>
      </div>
    </section>
  );
};

const CardSection = () => {
  const { data: recentData } = useQuery(getReviewCardArray("RECENT"));
  const { data: populerData } = useQuery(getReviewCardArray("POPULAR"));

  const recentReviewCardArray = recentData?.data ?? [];
  const populerReviewCardArray = populerData?.data ?? [];

  return (
    <>
      <section
        className="flex flex-col items-center gap-8 bg-gray-10 pb-13 pt-52 text-center tablet:pb-26"
        id="cardSection"
      >
        <p className="text-12 leading-18 text-gray-50 tablet:text-16 tablet:leading-24">
          그 여행지, 실제 후기는 어떨까?
        </p>
        <p className="font-bold mobile:text-16 mobile:leading-24 tablet:text-24 tablet:leading-36">
          실시간으로 올라오는 유저의 리뷰를 참고해
          <br />
          <span className="text-primary">나만의 여행 계획</span>을 세워보세요.
        </p>
      </section>

      <section className="bg-gray-10 pb-46">
        <div className="flex flex-col gap-24 tablet:gap-40">
          {recentReviewCardArray && (
            <MultiReviewCardSlider title="최신리뷰" align="left" reviewCards={recentReviewCardArray} />
          )}
          {populerReviewCardArray && (
            <MultiReviewCardSlider title="인기리뷰" align="right" reviewCards={populerReviewCardArray} />
          )}
        </div>
      </section>
    </>
  );
};

const TagSection = () => {
  const tagArray: TagWithMonth[] = [
    "맑음",
    "흐림",
    "우천",
    "눈",
    "맛집",
    "관광",
    "휴양",
    "명소",
    "가족",
    "친구",
    "연인",
    "혼자",
  ];

  const tagClassArray = [
    "top-0 tablet:py-12 pt-20 pb-27 animate-marquee whitespace-nowrap",
    "absolute top-0 tablet:py-12 pt-20 pb-27 animate-marquee2 whitespace-nowrap",
  ];

  return (
    <section className="bg-gray-60 pt-20 text-center tablet:pb-89 tablet:pt-63">
      <div className="flex flex-col gap-8 tablet:mb-60">
        <p className="text-12 leading-18 text-white tablet:text-16 tablet:leading-24">태그 검색</p>
        <p className="font-bold text-white mobile:text-16 mobile:leading-24 tablet:text-24 tablet:leading-36">
          태그를 통해 다른 유저의 여행 리뷰를
          <br />
          <span className="text-primary">쉽고 디테일</span>하게 검색할 수 있어요.
        </p>
      </div>

      {/* 태그 계속 흘러가는 부분 */}
      <div className="relative flex overflow-x-hidden">
        {tagClassArray.map((item, index) => {
          return (
            <div className={item} key={index}>
              {tagArray.map((tag) => {
                return (
                  <Clickable
                    className="ml-8 tablet:ml-17 tablet:px-25 tablet:py-8 tablet:text-28 tablet:leading-42"
                    key={tag}
                    size="small"
                    shape="capsule"
                    color="white-"
                  >
                    <Emoji>{tag}</Emoji>
                  </Clickable>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const ServiceExplainSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cardSection = document.getElementById("cardSection") as HTMLSpanElement;
  const cardSectionTop = cardSection.offsetTop;

  const handleClick = () => {
    scrollTo({ top: cardSectionTop, behavior: "smooth" });
  };

  return (
    <section className="flex flex-col gap-140 bg-gray-10 pb-176 pt-148">
      <div className="flex items-center">
        <div className="relative h-626 w-1/2 overflow-hidden">
          <Image className="absolute right-0 min-w-882" src={desktopScreenShot1} alt="" width={882} />
        </div>

        <div className="ml-80 flex h-fit w-1/2  flex-col gap-24 rounded-l-full bg-white pb-109 pl-152 pt-128 shadow-main">
          <div>
            <p className="text-16 font-medium leading-24">마이 페이지</p>
            <p className="text-24 font-bold leading-36">
              지금까지 여행의 기록들을
              <br />
              <span className="text-primary">지도</span>로 이어보세요.
            </p>
          </div>

          <Link href="/">
            <Clickable className="w-max px-20" color="primary" shape="square" size="medium">
              나의 리뷰보기
            </Clickable>
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <div className="mr-80 flex h-fit w-1/2 flex-col items-end gap-24 rounded-r-full bg-white pb-109 pr-152 pt-128 text-right shadow-main">
          <div>
            <p className="text-16 font-medium leading-24">리뷰</p>
            <p className="text-24 font-bold leading-36">
              다른 유저의 <span className="text-primary">리뷰</span>를 저장하고
              <br />
              나의 여행에 참고해보세요.
            </p>
          </div>

          <button type="button" onClick={handleClick}>
            <Clickable className="w-max px-20" color="primary" shape="square" size="medium">
              리뷰 둘러보기
            </Clickable>
          </button>
        </div>

        <div className="relative h-626 w-1/2 overflow-hidden">
          <Image className="absolute left-0 min-w-882" src={desktopScreenShot2} alt="" width={882} />
        </div>
      </div>
    </section>
  );
};

const DeviceSection = () => {
  return (
    <section className="bg-gray-10 pb-52">
      <div className="mx-auto flex flex-col gap-12 tablet:w-690 laptop:w-1038">
        <h3 className="leading-16 inline w-fit rounded-100 bg-white px-8 py-3 text-11 font-bold shadow-main tablet:px-15 tablet:py-8 tablet:text-18 tablet:leading-27">
          디바이스 지원
        </h3>

        <div className="flex gap-8 tablet:gap-16 laptop:gap-24">
          <div className=" h-194 w-159 overflow-hidden rounded-10 bg-gray-60 p-24 tablet:h-286 tablet:w-220 laptop:h-430 laptop:w-330 laptop:rounded-30">
            <p className="text-right text-12 leading-18 text-gray-30">Mobile</p>
            <Image className="mx-auto mt-33" src={mobile} alt="" width={237} />
          </div>

          <div className=" flex h-194 w-159 flex-col justify-between overflow-hidden rounded-10 bg-gray-60 p-8 tablet:h-286 tablet:w-220 tablet:p-16 laptop:h-430 laptop:w-330 laptop:rounded-30 laptop:p-24">
            <p className="text-right text-24 font-bold leading-36 text-white">
              언제 어디서나
              <br />
              <span className="text-primary">간편하게</span>
              <br />
              작성할 수 있어요
            </p>
            <div className="flex h-120 w-120 items-center justify-center rounded-100 bg-primary">
              <Image src={quill} alt="" width={47} height={45} />
            </div>
          </div>

          <div className=" h-194 w-159 overflow-hidden rounded-10 bg-gray-60 p-24 tablet:h-286 tablet:w-220 laptop:h-430 laptop:w-330 laptop:rounded-30">
            <p className="text-right text-12 leading-18 text-gray-30">Desktop</p>
            <Image className="ml-61 mt-85" src={desktop} alt="" width={270} />
          </div>
        </div>
      </div>
    </section>
  );
};

const RightNowSection = () => {
  return (
    <section className="flex flex-col items-center gap-18 bg-gray-60 py-52 tablet:gap-24 tablet:py-92">
      <p className="text-center text-18 font-bold leading-27 text-white tablet:text-28 tablet:leading-42">
        쉽고 간편한 여행 리뷰,
        <br />
        지금 바로 작성해보세요!
      </p>

      <Link href="/review">
        <Clickable className="w-max px-12 py-5 tablet:px-20 tablet:py-12" color="primary" shape="square" size="medium">
          리뷰 작성하기
        </Clickable>
      </Link>
    </section>
  );
};
