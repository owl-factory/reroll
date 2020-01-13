import { Box, Button, Grid, Input, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import News from "../components/announcements/News";
import LoginBox from "../components/authetication/LoginCard";
import Page from "../components/Page";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(props: any) {

  // TODO - move the session up to App
  const [session, setSession] = React.useState({
    "isLoggedIn": true,
  });

  if (session.isLoggedIn) {
    return <UserView session={session} setSession={setSession}/>;
  }

  return (
    <GuestView session={session} setStsetSessionate={setSession}/>
  );
}

function UserView(props: any) {
  return (
    <Page>
      The User View

      <div>
        <Input type="text" placeholder="Enter your username..."> </Input>
      </div>
      <div>
        <Button title="Your Account" color="secondary" variant="contained">
          Go To Profile
        </Button>
      </div>
      <div>
        <Input type="text" placeholder="Enter new username..."></Input>
      </div>
      <div>
        <Button title="Your Account" color="secondary" variant="contained">
          Create User
        </Button>
      </div>
      <div>
        <Link href="../laura-playground" passHref>
          <Button title="Laura's Playground" color="secondary" variant="contained">
            Laura's Playground
          </Button>
        </Link>
      </div>
      <div>
        Character Sheets<br />
        <Link href="../character" passHref>
          <Button title="New Character Sheet" color="secondary" variant="contained">
            Waals
          </Button>
        </Link>
      </div>
    </Page>
  );
}

function GuestView(props: any) {

  return (
    <Page>
      <Typography variant="h3" paragraph>
        Welcome to Reroll!
      </Typography>
      <Typography variant="body1" paragraph>
        Reroll is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </Typography>

      <Link href="/about" passHref>
        <Button title="About" color="secondary" variant="contained">
          About
        </Button>
      </Link>

      <Grid container>
        <Grid item md={8} sm={12}>
          <Typography variant="body1">
            Some stuff goes here
          </Typography>
        </Grid>
        <Grid item md={4} sm={12}>
          <LoginBox session={props.session} setSession={props.setSession}/>
        </Grid>
      </Grid>

      <News/>

      <div>
        <Input type="text" placeholder="Enter your username..."> </Input>
      </div>
      <div>
        <Button title="Your Account" color="secondary" variant="contained">
          Go To Profile
        </Button>
      </div>
      <div>
        <Input type="text" placeholder="Enter new username..."></Input>
      </div>
      <div>
        <Button title="Your Account" color="secondary" variant="contained">
          Create User
        </Button>
      </div>
      <div>
        <Link href="../laura-playground" passHref>
          <Button title="Laura's Playground" color="secondary" variant="contained">
            Laura's Playground
          </Button>
        </Link>
      </div>
      <div>
        Character Sheets<br />
        <Link href="../character" passHref>
          <Button title="New Character Sheet" color="secondary" variant="contained">
            Waals
          </Button>
        </Link>
      </div>
    </Page>
  );
}

export default Index;
