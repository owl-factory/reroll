import React from "react";
import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { MdBuild, MdInfo, MdPageview } from "react-icons/md";
import ContextMenu from "../../design/contextMenus/ContextMenu";
import { GameSystem, Module } from "@reroll/model/dist/documents";
import { PageState } from "../../design/Pagination";
import { TableComponentProps } from "../../../model/design/table";

interface ModuleTableProps {
  gameSystem: GameSystem;
  modules: Module[];
  pageState: PageState;
}

const moduleActions = new ContextMenuBuilder()
  .addLink("View", MdPageview, "/[gameSystemAlias]/modules/[moduleAlias]")
  .addLink("Details", MdInfo, "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]")
  .addLink("Edit", MdBuild, "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]/edit");

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function ModuleActions({ data, globalData }: TableComponentProps) {
  const typedGlobalData = globalData as Record<string, unknown>;

  return (
    <ContextMenu
      context={{
        name: data.name,
        moduleAlias: data.alias || data._id,
        gameSystemAlias: typedGlobalData.alias || typedGlobalData._id,
      }}
      {...moduleActions.renderConfig()}
    />
  );
}
const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Module", "name")
  .addDataColumn("Alias", "alias")
  .addDataColumn("Publish Type", "publishType")
  .addComponentColumn("Tools", ModuleActions);

export default function ModuleTable(props: ModuleTableProps): JSX.Element {
  return <Table
    {...tableBuilder.renderConfig()}
    data={props.modules}
    globalData={props.gameSystem as Record<string, unknown>}
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />;
}
