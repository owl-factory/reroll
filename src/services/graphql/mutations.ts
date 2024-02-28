/* eslint-disable no-restricted-syntax */
import type { MutationResolvers, Todo } from "types/graphql";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { NewTodo } from "types/database";
import { ErrGraphql, GraphqlResult, getQueryFields } from "utils/graphql";
import { deleteUser, loginUser, logoutSession, signupUser } from "services/authentication";
import { createContent, deleteContent } from "services/content";

/**
 * GraphQL resolver map of all mutation resolvers. Used for GraphQL request that needs to write data.
 * Joined with query resolvers to make the full resolver map.
 */
export const mutations: MutationResolvers = {
  /**
   * Takes user signup information, create a new user in the database and then optionally log them in immediately.
   * @param args - Sign up form fields.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns void or the `id` of a session for the newly created user.
   */
  signup: async (_, args) => {
    const res = await signupUser(
      args.email,
      args.username,
      args.password,
      args.logIn,
      args.setCookie,
      args.displayName || undefined
    );
    return GraphqlResult(res);
  },

  /**
   * Authenticate a user with their credentials and create a session for them, which will always be returned by the resolver but may
   * also be save to a cookie if the `setCookie` argument is `true`.
   * @param args - Argument object containing `username: string` (username or email of the account to log in to), `password: string`,
   * and `setCookie: boolean` fields.
   * @returns ID of the session generated for a newly logged in user.
   */
  login: async (_, args) => {
    const res = await loginUser(args.username, args.password, args.setCookie);
    return GraphqlResult(res);
  },

  /**
   * Authenticate a user session and then log out (delete) that session. Will also try to delete the associated cookie if `deleteCookie` argument is `true`.
   * @param args - Argument object containing just `deleteCookie: boolean`.
   * @returns ID of the session that was just logged out.
   */
  logout: async (_, args) => {
    const res = await logoutSession(args.deleteCookie);
    return GraphqlResult(res);
  },

  /**
   * If authenticates, deletes a user.
   * @param args - A the `id` and `username` fields of the user to delete. They must match, and both are required to make user deletion require more intention.
   * @returns `id` of the deleted user.
   */
  deleteUser: async (_, args) => {
    const res = await deleteUser(args.id, args.username, args.deleteCookie);
    return GraphqlResult(res);
  },

  /**
   * If user is authenticated, creates a new Content item in the database.
   * @param args - Fields that make up a Content database object, with some optional fields or fields with defaults potentially not included.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns newly created Content object filtered to requested fields.
   */
  createContent: async (_, args, _context, info) => {
    const queryFields = getQueryFields<"content">(info);
    const res = await createContent(
      { ...args, visibility: args.visibility ?? undefined },
      queryFields
    );
    return GraphqlResult(res);
  },

  /**
   * If user is authenticated, deletes a Content item from the database.
   * @param args - Argument object containing only the `id` of the Content to be deleted.
   * @returns `id` of the deleted Todo.
   */
  deleteContent: async (_, args) => {
    const res = await deleteContent(args.id);
    return GraphqlResult(res);
  },

  /**
   * If user is authenticated, creates a new Todo item in the database.
   * @param args - Fields that make up a Todo database object, with some optional fields potentially not included.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns newly created Todo object filtered to requested fields.
   */
  createTodo: async (_, args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      return ErrGraphql(auth);
    }
    const queryFields = getQueryFields<"todo">(info);
    const newTodo = database
      .insertInto("todo")
      .values(args as NewTodo)
      .returning(queryFields)
      .executeTakeFirst();
    return newTodo as Promise<Todo>;
  },

  /**
   * If user is authenticated, updates a Todo item in the database.
   * @param args - Fields that make up a Todo database object, with some optional fields potentially not included, but `id` is strictly required.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns updated Todo object filtered to requested fields.
   */
  updateTodo: async (_, args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      return ErrGraphql(auth);
    }
    const queryFields = getQueryFields<"todo">(info);
    const updatedTodo = database
      .updateTable("todo")
      .where("id", "=", args.id as string)
      .set(args as NewTodo)
      .returning(queryFields)
      .executeTakeFirst();
    return updatedTodo as Promise<Todo>;
  },

  /**
   * If user is authenticated, deletes a Todo item in the database.
   * @param args - Argument object containing only the `id` of the Todo to be deleted.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns `id` of the deleted Todo.
   */
  deleteTodo: async (_, args) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      return ErrGraphql(auth);
    }
    const deleted = await database
      .deleteFrom("todo")
      .where("id", "=", args.id)
      .returning("id")
      .executeTakeFirst();
    if (deleted !== undefined) {
      return deleted.id;
    } else {
      return ErrGraphql(`Item with ID '${args.id}' not found in database.`);
    }
  },
};
