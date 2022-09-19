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

function A({ children, href, isActive = false }: { children: React.ReactNode; href: string; isActive?: boolean }) {
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

  const currentNumber = Number(params[numberParameter]) || 1;
  const startNum = currentNumber - ((currentNumber - 1) % range);

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
    let jsx = [];

    for (let i = 0; startNum + i <= maxNumber && i < range; i++) {
      const num = startNum + i;
      jsx.push(
        <li key={num}>
          <A href={combineUrl(num)} isActive={currentNumber === num}>
            {num}
          </A>
        </li>
      );
    }

    return jsx;
  }

  //TODO-YH 페이징 방식 협의 필요 = 현재는 1칸씩
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
        {numbers()}
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
