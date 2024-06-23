(() => {
  const waiting_room_html = `
    <title>Waiting Room</title>
    <meta http-equiv='refresh' content='30' />
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        line-height: 1.4;
        font-size: 1rem;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        padding: 2rem;
        display: grid;
        place-items: center;
        min-height: 100vh;
      }
      .container {
        width: 100%;
        max-width: 800px;
      }
      p {
        margin-top: .5rem;
      }
    </style>
    <div class='container'>
      <h1>
        <div>You are now in line.</div>
        <div>Thanks for your patience.</div>
      </h1>
      <p>We are experiencing a high volume of traffic. Please sit tight and we will let you in soon.</p>
      <p><b>This page will automatically refresh, please do not close your browser.</b></p>
    </div>
  `;

  const default_html = `
    <title>Waiting Room Demo</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        line-height: 1.4;
        font-size: 1rem;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        padding: 2rem;
        display: grid;
        place-items: center;
        min-height: 100vh;
      }
      .container {
        width: 100%;
        max-width: 800px;
      }
      p {
        margin-top: .5rem;
      }
    </style>
    <div class="container">
      <h1>
        <div>Waiting Room Demo</div>
      </h1>
      <p>Visit this site from a different browser, you will be forwarded to the waiting room when the capacity is full.</p>
      <p>Check <a href="https://github.com/upstash/waiting-room" style="color: blue;">this project</a> to set up a waiting room for your website.</p>
    </div>
  `;

  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });

  const COOKIE_NAME_ID = "__waiting_room_id";
  const COOKIE_NAME_TIME = "__waiting_room_last_update_time";
  const CAPACITY_LIMIT = 1; // Set your actual capacity limit
  const SESSION_DURATION_SECONDS = 10; // Set your actual session duration in seconds

  async function handleRequest(request) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/favicon")) {
      return fetch(request);
    }

    const cookies = parseCookies(request.headers.get("Cookie") || "");
    const userId = cookies[COOKIE_NAME_ID] || crypto.randomUUID();

    const currentCapacity = await getCurrentCapacity();
    console.log("current capacity:" + currentCapacity);

    if (currentCapacity < CAPACITY_LIMIT || await isUserInQueue(userId)) {
      return waitingRoomResponse();
    }

    return defaultResponse();
  }

  function parseCookies(cookieString) {
    const cookies = {};
    cookieString.split(";").forEach((cookie) => {
      const [name, value] = cookie.split("=");
      if (name && value) {
        cookies[name.trim()] = value.trim();
      }
    });
    return cookies;
  }

  async function getCurrentCapacity() {
    const response = await fetch("http://webdis.astroadrenaline.com:7379/dbsize");
    const data = await response.json();
    return data.DBSIZE;
  }

  async function isUserInQueue(userId) {
    const response = await fetch(`http://webdis.astroadrenaline.com:7379/get/${userId}`);
    const data = await response.json();
    return data.GET === "true";
  }

  async function waitingRoomResponse() {
    const response = new Response(waiting_room_html);
    response.headers.set("content-type", "text/html;charset=UTF-8");
    return response;
  }

  function defaultResponse() {
    const response = new Response(default_html);
    response.headers.set("content-type", "text/html;charset=UTF-8");
    return response;
  }
})();

