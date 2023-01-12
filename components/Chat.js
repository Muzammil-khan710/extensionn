import React, { useEffect, useState } from "react";

const Chat = () => {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    sendBotMsg();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  async function onSubmit(event) {
    event.preventDefault();

    setMessages((prev) => [...prev, { sender: "user", msg: textInput }]);

    try {
      const response = await fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textInput: textInput }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setTextInput("");

      sendBotMsg();
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const sendBotMsg = () => {
    console.log(result, "--result");
    if (result) {
      setMessages((prev) => [...prev, { sender: "bot", msg: result }]);
      setResult("");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className='form_input'>
        <input
          type="text"
          name="text"
          placeholder="Enter an text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="input_text"
        />
        <input type="submit" value="Submit" className="submit_button" />
      </form>

      <div className="container">
        {messages.map((el, id) => {
          return (
            <div
              className={el?.sender === "user" ? "msg_user" : "msg_bot"}
              key={id}
            >
              {el.msg}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
