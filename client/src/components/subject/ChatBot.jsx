import React, { useState, useEffect, useRef } from "react";
import NoEnroll from "./NoEnroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faRocket,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

import { sendToChatBot, getChatBotHistory } from "@services/ChatBotService";
import ChatContent from "@components/subject/ChatContent";

function ChatBot({ subject, hasEnrolled }) {
  if (!hasEnrolled) {
    return <NoEnroll action={"Chatbot"} />;
  }
  const [history, setHistory] = useState([]);
  const textInputRef = useRef(null);
  const rocketButtonRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState("new");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const sendToChat = () => {
    let content = textInputRef.current.value;
    chatPayload.prompt = content;
    let message = {
      content: content,
      type: "human",
    };

    setHistory((prevHistory) => [...prevHistory, message]);
    textInputRef.current.value = "";

    sendToChatBot(chatPayload).then((res) => {
      let answer = res.data.response.answer;
      let references = res.data.response.references;
      let response = {
        content: answer,
        type: "ai",
      };
      let reference = {
        content: references,
        type: "reference",
      };
      setHistory((prevHistory) => [...prevHistory, response, reference]);
    });
  };
  const changeRocket = (elem) => {
    if (elem.value) {
      rocketButtonRef.current.classList.add("active");
    } else {
      rocketButtonRef.current.classList.remove("active");
    }
  };

  let chatPayload = {
    prompt: "",
    grade: "11",
    subject: { subject },
    student_id: "232",
    chat_session_id: "chat11",
  };

  useEffect(() => {
    if (selectedValue !== "new") {
      getChatBotHistory({
        chat_session_id: chatPayload.chat_session_id,
      }).then((res) => {
        history.push(res.data.response);
        setHistory(...history);
      });
    }
  }, [selectedValue]);
  return (
    <div className="chatbot">
      <div className="title-wrapper">
        <div className="title flex-sb">
          <h3>{subject}</h3>
          <select
            class="select select-bordered w-full max-w-xs"
            onChange={handleChange}
          >
            <option value={"chat-id-1"}>
              <h4>Option 1</h4>
            </option>
            <option value={"chat-id-1"}>
              <h4>Option 2</h4>
            </option>
            <option value={"chat-id-1"}>
              <h4>Option 3</h4>
            </option>
            <hr />
            <option value={"new"} selected>
              <h4>New Conversation</h4>
            </option>
          </select>
        </div>
      </div>
      <ChatContent messageList={history} />
      <div className="chat-control">
        <div className="chat-input-wrapper">
          <textarea
            name="chat-input"
            id="chat-input"
            ref={textInputRef}
            onInput={(e) => changeRocket(e.target)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                sendToChat();
                changeRocket(rocketButtonRef.current);
              }
            }}
          />
          <FontAwesomeIcon
            icon={faRocket}
            size="3x"
            ref={rocketButtonRef}
            onClick={sendToChat}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
