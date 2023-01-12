import React, { useState } from "react";

const Chat = () => {
  //   const [message, setMessage] = useState("");
  //   const [messages, setMessages] = useState([
  // {
  //   sender: "user",
  //   msg: "hiii",
  // },
  // {
  //   sender: "bot",
  //   msg: "hello",
  // },
  // {
  //   sender: "user",
  //   msg: "What's my name",
  // },
  // {
  //   sender: "bot",
  //   msg: "Your name is Amit Rawat",
  // },
  //   ]);

  //   new js
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textInput: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setTextInputt("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  //   new js

  //   const sendUserMsg = () => {
  //     setMessages((prev) => [...prev, { sender: "user", msg: message }]);
  //     setMessage("");

  //     setTimeout(sendBotMsg, 1000);
  //     // sendBotMsg();
  //   };
  const sendBotMsg = () => {
    setMessages((prev) => [...prev, { sender: "bot", msg: { result } }]);
  };

  return (
    <div>
      <div className="container">
        {messages.map((el, id) => {
          return (
            // <div className="msgContainer">
            <div className={el?.sender === "user" ? "msg_user" : "msg_bot"}>
              {el.msg}
            </div>
            // </div>
          );
        })}
      </div>
      {/* <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input> */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="animal"
          placeholder="Enter an text"
          value={TextInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <input type="submit" value="Generate names" />
      </form>
      <div className="">
        <h1>{result}</h1>
      </div>
    </div>
  );
};

export default Chat;
