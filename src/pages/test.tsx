import { Page } from "components/design";
import React from "react";
import { isClient } from "@owl-factory/utilities/client";

export default function Test(): JSX.Element {
  if (isClient) {
    console.log("hop");
  }

  return (
    <Page>
      Test
      <button>Test</button>
    </Page>
  );
}
