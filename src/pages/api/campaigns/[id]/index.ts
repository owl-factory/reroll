import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { CampaignLogic, UserLogic } from "server/logic";
import { createEndpoint } from "server/utilities";
import { getMyUser } from "server/auth";
import { getUniques } from "utilities/arrays";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPage(this: HTTPHandler, req: NextApiRequest) {
  const campaign = await CampaignLogic.findByID(req.query.id as string);
  campaign.players = await UserLogic.findManyByIDs(getUniques(campaign.players, "id"));

  this.returnSuccess({ campaign: campaign });
}

export default createEndpoint({GET: getCampaignPage});
