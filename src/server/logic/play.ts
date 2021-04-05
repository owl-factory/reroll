import { Dispatch, DispatchEvent } from "types";
import { CampaignLogic } from "server";
import { MessageModel } from "server/models";
import { MessageDoc } from "types";

export class PlayLogic {
  /**
   * Fetches messages for a campaign
   * @param campaignID The id of the campaign to fetch messages for
   */
  public static async fetchMessages(campaignID: string): Promise<MessageDoc[]> {
    const messages = await MessageModel.find({ campaign: campaignID }).sort({createdAt: 1}).limit(100);
    return messages;
  }

  /**
   * Handles receiving a flush from the host of a game server
   * @param myUserID The id of the user saving this information to the database
   * @param campaignID The id of the campaign that is being saved
   * @param dispatchHistory The dispatch history to replicate in the data
   */
  public static async handleFlush(
    myUserID: string,
    campaignID: string,
    dispatchHistory: Dispatch[]
  ): Promise<void> {
    const campaign = await CampaignLogic.fetchCampaign(myUserID, campaignID);
    if (!campaign) { throw { code: 404, message: "The campaign was not found." }; }

    const messages: MessageDoc[] = [];
    dispatchHistory.forEach((dispatch: Dispatch) => {
      switch(dispatch.event) {
        case DispatchEvent.Message:
          const message = dispatch.content;

          message.createdAt = new Date();
          message.updatedAt = message.createdAt;
          message.createdBy = myUserID;
          message.updatedBy = message.createdBy;
          message.campaign = campaignID;
          // TODO - other handling in here
          messages.push(message);
      }
    });
    if (messages.length) {
      await MessageModel.insertMany(messages);
    }
  }
}
