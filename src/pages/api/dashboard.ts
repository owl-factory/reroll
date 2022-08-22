import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { CampaignLogic } from "server/logic/CampaignLogic";

/**
 * Fetches the information needed for the current user's dashboard page.
 */
export async function getDashboardPage(_req: NextApiRequest) {
  const campaigns = await CampaignLogic.fetchMyCampaigns({ size: 6 });
  return { campaigns: campaigns };
}

/**
 * Fetches the information needed for the current user's dashboard page.
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getDashboardPageRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getDashboardPage(req));
}

export default createEndpoint({GET: getDashboardPageRequest});
