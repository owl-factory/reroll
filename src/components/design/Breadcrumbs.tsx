import React from "react";
import { Breadcrumb as BSBreadcrumb } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { def } from "../../utilities/tools";

interface BreadcrumbProps {
  skipLevels?: number;
  titles?: string[];
}

/**
 * A simple breadcrumb component that builds out the links from the URL. 
 * @param props.skipLevels A number indicating how many levels to skip. Default 0
 * @param props.titles An array of strings for the title of each level
 */
function Breadcrumbs(props: BreadcrumbProps) {
  const router = useRouter();
  const skipLevels: number = def<number>(props.skipLevels, 0);
  const titles: string[] = def<string[]>(props.titles, []);

  /**
   * Builds out the breadcrumb links
   */
  function buildCrumbs() {
    // TODO - BUG where trailing / causes extra slash to appear in breadcrumbs
    const crumbs = router.asPath.split("/");
    const breadcrumbs: JSX.Element[] = [];
    let uri = "/";

    for (let i: number = 0; i < crumbs.length; i++) {
      const titleIndex: number = i - skipLevels;
      uri += crumbs[i];

      if (titleIndex < 0) {
        continue;
      }

      let title: string = crumbs[i];
      if (titles.length >= titleIndex) {
        title = titles[titleIndex];
      }

      breadcrumbs.push(
        <Link key={"crumb_" + i} href={uri} passHref>
          <BSBreadcrumb.Item>{title}</BSBreadcrumb.Item>
        </Link>,
      );

      if (i < crumbs.length - 1) {
        uri += "/";
      }
    }

    return breadcrumbs;
  }

  return (
    <BSBreadcrumb>
      { buildCrumbs() }
    </BSBreadcrumb>
  );
}

export default Breadcrumbs;
