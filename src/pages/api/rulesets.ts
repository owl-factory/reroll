import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesets(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetLogic.findManyByIDs(req.body.id);
  this.returnSuccess({ docs: rulesets });
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.createOne(req.body);
  this.returnSuccess({ ruleset });
}

export default createEndpoint({
  POST: getRulesets,
  PUT: createRuleset,
});
