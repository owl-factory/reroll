import { CoreDocument } from ".";
import { CampaignDocument } from "./Campaign";


export interface CampaignInviteDocument extends CoreDocument {
  campaign?: CampaignDocument;

  inviteAddress?: string;
  ttl?: Date; // TODO - uuuuuuhhh remove? Or rename to something we clean up ourselves? idk
}
