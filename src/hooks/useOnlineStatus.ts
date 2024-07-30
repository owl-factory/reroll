import { useEffect, useState } from "react";
import { Err, Ok, ErrUnknown } from "utils/results";

/**
 * Time, in milliseconds, between online status checks.
 */
const checkStatusTime = 60 * 1000;

/**
 * React hook that periodically pings Lantern's `/api/ping` endpoint to check if we are online,
 * then saves that value to state and returns it to the hook caller.
 * Only used in the site-wide Environment Context provider.
 * @returns true if site is online, false if site is offline.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  function handleSetOnlineStatus() {
    ping().then((result) => {
      setIsOnline(result.ok);
    });
  }

  useEffect(() => {
    handleSetOnlineStatus();
    const intervalId = setInterval(handleSetOnlineStatus, checkStatusTime);
    return () => clearInterval(intervalId);
  }, []);

  return isOnline;
}

/**
 * Function that calls the endpoint `/api/ping` and safely handles the result.
 * @returns safely wrapped result of the fetch request to `/api/ping`.
 */
export async function ping(): Promise<Result> {
  try {
    const response = await fetch("/api/ping");
    if (response.ok && response.status === 200) {
      return Ok();
    } else {
      return Err(`Server error ${response.status}: ${response.statusText}.`);
    }
  } catch (error) {
    return ErrUnknown(error);
  }
}
