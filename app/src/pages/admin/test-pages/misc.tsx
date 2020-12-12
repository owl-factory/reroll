import React from "react";
import Page from "../../../components/design/Page";
import { Button } from "react-bootstrap";
import Tooltip from "../../../components/design/Tooltip";

/**
 * A page devoted to miscellaneous component testing
 */
export default function Miscellaneous(): JSX.Element {
  return (
    <Page>
      <h2>Miscellaneous Testing</h2>
      <h3>Tooltips</h3>
      <Tooltip title="Click this button for more information"><Button>Hi!</Button></Tooltip>
    </Page>
  );
}
