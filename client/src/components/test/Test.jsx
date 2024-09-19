import React, { useState, useEffect } from "react";
// import { useAuthorizer } from "@hooks";

import useWebSocket from "react-use-websocket";

// function Test() {
//   const auth = useAuthorizer();

//   useEffect(() => {
//     async function foo() {
//       const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
//       await sleep(5000);
//       console.log("finished");
//       auth.authorize(false);
//     }
//     foo();
//   }, []);

//   return (
//     <>
//       <h2 onClick={() => {}}>Foo</h2>
//     </>
//   );
// }

function Test() {
  const [socketUrl, setSocketUrl] = useState(
    `${import.meta.env.VITE_WEBSOCK_API}/ws-assignment`
  );
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connected"),
    shouldReconnect: (closeEvent) => true,
  });
  useEffect(() => {
    sendMessage(
      "SUBSCRIBE\nid:sub-0\ndestination:/topic/assignment-time/as6242d556-c648-43e5-9ea2-f17bcc62a6e0\n\n\0"
    );
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
    }
  }, [lastMessage]);
  return <></>;
}

export default Test;
