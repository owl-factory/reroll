import fetch from "cross-fetch";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { query as q } from "faunadb";
import { getClient, updateClient } from "@owl-factory/database/client/fauna";
import { rest } from "@owl-factory/https/rest";
import { UserDocument } from "types/documents";
import { Auth } from "controllers/auth";

// TODO - COMMENT AND REFACTOR

/**
 * Sends a request to sign a user up to the API
 * @param username The username of the user attempting to sign up
 * @param email The email of the user attempting to sign up
 * @param password The password of the user attempting to sign up
 */
export function signUp(username: string, email: string, password: string): void {
  fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, email, password}),
  }).then(async (res) => {
    const session: any = await res.json();
    updateClient(session.secret);
    Router.reload();
  });
}

/**
 * Attempts to log in a user
 * @param username The username of the user to log in
 * @param password The password of the user to log in
 */
export async function signIn(username: string, password: string): Promise<string> {
  const result = await rest.post<{ user: UserDocument }>("/api/auth/signin", { username, password });
  if (!result.success) {
    return result.message;
  }
  Auth.setUser(result.data.user);
  Router.reload();
  return "";
}

/**
 * Logs a user out
 */
export function signOut(): void {
  Auth.resetUser();
  Router.reload();
}

export type CtxRes = Pick<NextPageContext, "res"> | {res: NextApiResponse<any>;} | null | undefined;
export type CtxReq = Pick<NextPageContext, "req"> | {req: NextApiRequest;} | null | undefined;

/**
 * Sets a session in the cookies
 * @param session The session to set
 * @param ctx The Next Page Context
 */
export function setSession(session: any, ctx?: CtxRes): void {
  setCookie(ctx, "session", JSON.stringify(session), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
}

/**
 * Destroys the session
 * @param ctx The next page context
 */
export function destroySession(ctx?: CtxRes): void {
  destroyCookie(ctx, "session", { path: '/' });
}

/**
 * Fetches the current session, if any
 * @param ctx The Next page context
 * @returns The current session
 */
export function getSession(ctx?: CtxReq): any | null {
  const cookie = parseCookies(ctx).session;
  if (!cookie)
    return null;
  const session: any = JSON.parse(cookie);
  return session;
}

/**
 * Returns true if the user is logged in, false otherwise, or sends the user to the home page
 * @param session The current session, if any
 * @param ctx The Next Page Context
 */
export function requireClientLogin(session: any | null, ctx?: NextPageContext) {
  if (!session) {
    if (ctx && ctx.res) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    } else {
      Router.push("/");
    }
    return false;
  }
  return true;
}
