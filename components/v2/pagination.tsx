import cls from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  //보여줄 버튼 개수
  range?: number;
  //마지막 페이지 번호
  maxNumber: number;
  //페이지 번호 key
  numberParameter?: string;
  sizeParameter?: string;
}

function A({ children, href, isActive = false }: { children: React.ReactNode; href: string; isActive?: boolean; isDisabled?: boolean }) {
  return (
    <Link href={href}>
      <a
        className={cls(
          "flex h-[38px] w-[38px] items-center justify-center rounded-full border text-[15px]",
          { "border-[#CFE3FF] text-blue hover:border-blue hover:bg-blue hover:text-white": !isActive },
          { "cursor-default border-blue bg-blue text-white": isActive }
        )}
      >
        {children}
      </a>
    </Link>
  );
}

function Pagination({ range = 5, maxNumber, numberParameter = "pageNumber", sizeParameter = "pageSize" }: Props) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) setIsReady(true);
  }, [router.isReady]);
  if (!isReady) return null;

  const [path, queryParameter] = router.asPath.split("?");
  const params = Object.fromEntries(new URLSearchParams(queryParameter).entries());

  const fixedRange = Math.floor((range - 1) / 2);
  const currentNumber = (() => {
    const num = Number(params[numberParameter]) || 1;
    return num < 1 ? 1 : num;
  })();

  function fixedStartRange() {
    //고정 최대 끝 번호
    const maxNumber = fixedRange + 1;

    if (currentNumber <= maxNumber) return null;

    const jsx = [];
    //계산된 끝 번호
    let lastNumber = currentNumber - maxNumber;
    if (lastNumber > maxNumber) lastNumber = maxNumber;

    for (let i = 1; i <= lastNumber && i <= fixedRange; i++) {
      jsx.push(
        <li key={i} data-key={i}>
          <A href={combineUrl(i)}>{i}</A>
        </li>
      );
    }

    if (lastNumber === maxNumber) {
      if (lastNumber === currentNumber - maxNumber) {
        jsx.push(
          <li key={lastNumber} data-key={lastNumber}>
            <A href={combineUrl(lastNumber)}>{lastNumber}</A>
          </li>
        );
      } else {
        jsx.push(
          <li key={lastNumber} data-key={lastNumber}>
            <span className="flex h-full w-7 items-center justify-center">&hellip;</span>
          </li>
        );
      }
    }

    return jsx;
  }

  function fixedEndRange() {
    //고정 최소 시작 번호
    const minNumber = maxNumber - fixedRange;

    if (currentNumber >= minNumber) return null;

    const jsx = [];
    //계산된 시작 번호
    let firstNumber = currentNumber + fixedRange + 1;
    if (firstNumber < minNumber) firstNumber = minNumber;

    if (firstNumber === minNumber) {
      if (firstNumber === currentNumber + fixedRange + 1) {
        jsx.push(
          <li key={firstNumber} data-key={firstNumber}>
            <A href={combineUrl(firstNumber)}>{firstNumber}</A>
          </li>
        );
      } else {
        jsx.push(
          <li key={firstNumber} data-key={firstNumber}>
            <span className="flex h-full w-7 items-center justify-center">&hellip;</span>
          </li>
        );
      }
      firstNumber++;
    }

    for (let i = firstNumber; i <= maxNumber; i++) {
      jsx.push(
        <li key={i} data-key={i}>
          <A href={combineUrl(i)}>{i}</A>
        </li>
      );
    }

    return jsx;
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

  function numbers() {
    let leftLength = Math.floor((range - 1) / 2);
    let rightLength = Math.floor(range / 2);

    let startNum = currentNumber - leftLength;
    if (startNum < 1) {
      rightLength += 1 - startNum;
      startNum = 1;
    }

    let endNum = currentNumber + rightLength;
    if (endNum > maxNumber) {
      startNum -= endNum - maxNumber;
      endNum = maxNumber;
    }

    const jsx = [];
    for (let i = startNum; i <= endNum; i++) {
      jsx.push(
        <li key={i}>
          <A href={combineUrl(i)} isActive={currentNumber === i}>
            {i}
          </A>
        </li>
      );
    }

    return jsx;
  }

  return (
    <nav aria-label="Pagination">
      <Head>
        {currentNumber !== 1 && <link rel="prev" href={combineUrl(currentNumber - 1)} />}
        {currentNumber !== maxNumber && <link rel="next" href={combineUrl(currentNumber + 1)} />}
      </Head>

      <ul className="flex justify-center gap-1">
        {currentNumber !== 1 && (
          <li key={"left"}>
            <A href={combineUrl(currentNumber - 1)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </A>
          </li>
        )}
        {fixedStartRange()}
        {numbers()}
        {fixedEndRange()}
        {currentNumber !== maxNumber && (
          <li key={"right"}>
            <A href={combineUrl(currentNumber + 1)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </A>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;
