import { ReturnModelType } from "@typegoose/typegoose";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query } from "mongoose";
import { validate } from "class-validator";
import { getUserID } from "../utilities/misc";
import { applyFilters, isID } from "../utilities/resolverHelpers";
import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";
import { CoreDocument } from "@reroll/model/dist/documents/CoreDocument";
import { CoreFilter } from "@reroll/model/dist/filters/CoreFilter";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";

// Contains any aliases that might be passed in to findByAlias for any super document
// TODO - move to a new file
interface SuperDocumentAliases {
  gameSystemID?: string;
}

type possibleSuperDocuments = keyof SuperDocumentAliases;

const superDocumentAliasModels: any = {
  gameSystemID: GameSystemModel
}

export class CoreResolver {
  // The Typegoose model for running all core requests
  // NOTE: Needs to be any
  protected model!: ReturnModelType<any>;

  /**
   * Finds a document by an alias or id and optionally the aliases/ids of other documents
   * @param alias The alias or ID of the document to find
   * @param superDocumentAliases The aliases of any owning documents that the target document must belong to
   */
  protected findByAlias(alias: string, superDocumentAliases?: SuperDocumentAliases): Promise<Query<CoreDocument> | null> {
    return this._findByAlias(alias, this.model, superDocumentAliases);
  }

  /**
   * Finds a collection of documents matching the given filters and options
   * 
   * @param filters Filters given to find specific documents
   * @param options General options for modifying results, such as length and how many to skip
   */
  protected findMany(filters?: CoreFilter, options?: Options): Query<CoreDocument[]> {
    return applyFilters(this.model.find({}, null, options), filters);
  }

  /**
   * Finds the count for the given filters
   * @param filters Filters used for determining what is counted
   */
  protected findCount(filters?: CoreFilter): Query<number> {
    return applyFilters(this.model.countDocuments({}), filters);
  }

  /**
   * Creates a single new document and inserts it into the database
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  protected async createOne(data: CoreDocument): Query<unknown> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    // Updates both so we can track when something was last created and when 
    // it was last touched easier
    data.createdAt = new Date();
    data.createdBy = getUserID();

    data.updatedAt = new Date();
    data.updatedBy = getUserID();

    return this.model.createOne(data);
  }

  /**
   * Updates a single document in the database
   * @param _id The id of the document to update
   * @param data The new data of the document to set
   */
  protected async updateOne(_id: string, data: CoreDocument): Query<UpdateResponse> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    data.updatedAt = new Date();
    data.updatedBy = getUserID();

    return this.model.updateOne({_id}, data);
  }

  /**
   * Hard deletes a single document
   * @param _id The id of the document to delete
   */
  protected async deleteOne(_id: string): Query<DeleteResponse> {
    return this.model.deleteOne({_id});
  }


  /**
   * A recursive function for finding by the alias or id. Recursion is for handling the super documents. 
   * The recursion should only go two levels deep at any given time. 
   * 
   * @param alias The alias or ID of the document to find
   * @param model The model to search through for our documents
   * @param superDocumentAliases A possible collection of aliases that may be given for sub-documents
   */
  private async _findByAlias(
    alias: string, 
    model: ReturnModelType<any>, // Note: also needs to be any
    superDocumentAliases?: any // TODO - properly type this
  ): Promise<Query<CoreDocument> | null> {
    // The search filters, to be used by the applyFilters function
    const filters: any = {};

    // Determines which filter we should use for finding by id or alias
    if (isID(alias)) {
      filters._id_eq = alias;
    } else {
      filters.alias_eq = alias;
    }

    // Fetch early if we don't need to worry about super document aliases
    if (!superDocumentAliases) { return applyFilters(model.findOne({}, null), filters); }

    // Get super document ids
    const superDocuments: string[] = Object.keys(superDocumentAliases);

    // We use a for loop over for each so we can easily return out
    for (let i = 0; i < superDocuments.length; i++) {
      const superDocument = superDocuments[i];
      // Catch case for typescripting
      if (!(superDocument in superDocumentAliases)) { 
        throw Error("Invalid super document alias")
      }

      // TODO - this function has weird typing. We need to change the any in the superDocumentAliases
      // and superDocumentAliasModels into specifically typed types
      const superDocumentResult = await this._findByAlias(
        superDocumentAliases[superDocument],
        superDocumentAliasModels[superDocument]
      );

      if (!superDocumentResult) { return null; }

      filters[`${superDocument}_eq`] = superDocumentResult._id;
    }

    return applyFilters(model.findOne({}, null), filters);
  }
}


