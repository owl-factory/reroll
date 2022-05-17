import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { ModuleData } from "controllers/data/ModuleData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import React from "react";

const ModuleRow = observer((props: any) => {
  const module = ModuleData.get(props.id);
  if (!module) { return <></>; }

  const ruleset = RulesetData.get((module.ruleset)?.ref);

  return (
    <TableRow>
      <TableCell>{module.name}</TableCell>
      <TableCell>{ruleset?.name || module.ruleset?.name}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
});

const ContentTypeTable = observer((props: any) => {
  React.useEffect(() => {
    ModuleData.searchIndex(`/api/modules/list`);
  }, []);

  const modules = ModuleData.search({ group: "data" });
  const rows: JSX.Element[] = [];

  for (const ref of modules) {
    rows.push(<ModuleRow key={ref} id={ref}/>);
  }

  return (
    <Table>
      <TableHead>
        <TableHeader>Name</TableHeader>
        <TableHeader>Ruleset</TableHeader>
        <TableHeader>Actions</TableHeader>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  );
});

export default function Modules() {

  return (
    <Page>
      <h1>Modules</h1>
      <ContentTypeTable/>
    </Page>
  );
}
