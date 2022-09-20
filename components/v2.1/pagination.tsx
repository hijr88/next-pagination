import cls from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  //보여줄 버튼 개수
  length?: number;
  //보여줄 고정 양쪽 끝 개수
  sideLength?: number;
  //마지막 페이지 번호
  endNumber: number;
  //페이지 번호 key
  numberParameter?: string;
  sizeParameter?: string;
}
const defaultClass = "flex h-[38px] w-[38px] items-center justify-center rounded-full border text-[15px]";

function A({ children, href, isActive = false }: { children: React.ReactNode; href: string; isActive?: boolean; isDisabled?: boolean }) {
  return isActive ? (
    <span className={cls(defaultClass, "cursor-default border-blue bg-blue text-white")}>{children}</span>
  ) : (
    <Link href={href}>
      <a className={cls(defaultClass, "border-[#CFE3FF] text-blue transition-all hover:border-blue hover:bg-blue hover:text-white")}>{children}</a>
    </Link>
  );
}

function Svg({ type }: { type: "left" | "right" }) {
  if (type === "left") {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    );
  } else {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );
  }
}

function Pagination({ length = 5, sideLength = 2, endNumber, numberParameter = "pageNumber", sizeParameter = "pageSize" }: Props) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) setIsReady(true);
  }, [router.isReady]);
  if (!isReady) return null;

  const [path, queryParameter] = router.asPath.split("?");
  const params = Object.fromEntries(new URLSearchParams(queryParameter).entries());

  const currentNumber = (() => {
    const num = Number(params[numberParameter]) || 1;
    return num < 1 ? 1 : num;
  })();

  function totalLength() {
    let totalLength = length;
    const beginNumber = rangeBeginNumber();
    if (beginNumber > 1) {
      const addLength = beginNumber - 1;
      totalLength += addLength > sideLength + 1 ? sideLength + 1 : addLength;
    }

    if (endNumber - sideLength > currentNumber) {
      const addLength = endNumber - currentNumber - sideLength;
      totalLength += addLength > sideLength + 1 ? sideLength + 1 : addLength;
    }

    return totalLength;
  }

  function rangeBeginNumber() {
    let beginNumber = currentNumber - Math.floor((length - 1) / 2);
    if (beginNumber < 1) beginNumber = 1;

    if (beginNumber + length - 1 > endNumber) {
      beginNumber = endNumber - length + 1;
    }

    return beginNumber;
  }

  function finalNumbers() {
    const array = Array(totalLength());
    let index = 0;
    let rangeBegin = rangeBeginNumber();
    let rangeEnd = rangeBegin + length - 1;

    //고정 시작점 채우기
    if (rangeBegin > 1) {
      const endNumber = rangeBegin - 1;

      for (let i = 0; i < endNumber && i < sideLength; i++) {
        array[index++] = (
          <li key={index}>
            <A href={combineUrl(index)}>{index}</A>
          </li>
        );
      }

      //숫자 및 줄임표
      if (endNumber > sideLength) {
        if (sideLength + 1 === endNumber) {
          array[index++] = (
            <li key={endNumber}>
              <A href={combineUrl(endNumber)}>{endNumber}</A>
            </li>
          );
        } else {
          array[index++] = (
            <li key="left-ellipsis">
              <span className="flex h-full w-[38px] items-center justify-center">&hellip;</span>
            </li>
          );
        }
      }
    }

    for (let i = 0; i < length; i++) {
      array[index++] = (
        <li key={rangeBegin + i}>
          <A href={combineUrl(rangeBegin + i)} isActive={currentNumber === rangeBegin + i}>
            {rangeBegin + i}
          </A>
        </li>
      );
    }

    //고정 끝점 채우기
    if (endNumber - rangeEnd > 0) {
      let beginNumber = (() => {
        let val = endNumber - sideLength;
        if (endNumber - rangeEnd <= sideLength) {
          val += sideLength + 1 - (endNumber - rangeEnd);
        }
        return val;
      })();

      if (endNumber - rangeEnd > sideLength) {
        if (rangeEnd + 1 === beginNumber) {
          array[index++] = (
            <li key={beginNumber}>
              <A href={combineUrl(beginNumber)}>{beginNumber}</A>
            </li>
          );
        } else {
          array[index++] = (
            <li key="right-ellipsis">
              <span className="flex h-full w-[38px] items-center justify-center">&hellip;</span>
            </li>
          );
        }
        beginNumber++;
      }

      for (let i = 0; i < sideLength && beginNumber <= endNumber; i++) {
        array[index++] = (
          <li key={beginNumber}>
            <A href={combineUrl(beginNumber)}>{beginNumber}</A>
          </li>
        );
        beginNumber++;
      }
    }
    return array;
  }

  function combineUrl(num: number) {
    const obj = { ...params };
    obj[numberParameter] = num + "";

    return (
      path +
      "?" +
      Object.entries(obj)
        .map(([k, v]) => k + "=" + v)
        .join("&")
    );
  }

  return (
    <nav aria-label="Pagination">
      <Head>
        {currentNumber !== 1 && <link rel="prev" href={combineUrl(currentNumber - 1)} />}
        {currentNumber !== endNumber && <link rel="next" href={combineUrl(currentNumber + 1)} />}
      </Head>
      <ul className="flex select-none justify-center gap-1">
        {currentNumber !== 1 ? (
          <li key="left">
            <A href={combineUrl(currentNumber - 1)}>
              <Svg type="left" />
            </A>
          </li>
        ) : (
          <li key="left">
            <span className={cls(defaultClass, "cursor-default border-gray-300 text-gray-300")}>
              <Svg type="left" />
            </span>
          </li>
        )}
        {finalNumbers()}
        {currentNumber !== endNumber ? (
          <li key="right">
            <A href={combineUrl(currentNumber + 1)}>
              <Svg type="right" />
            </A>
          </li>
        ) : (
          <li key="right">
            <span className={cls(defaultClass, "cursor-default border-gray-300 text-gray-300")}>
              <Svg type="right" />
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;
