import React, { useEffect, useState } from "react";

const Chat = () => {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    sendBotMsg(); //change ui send mess bot
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  async function onSubmit(event) {
    event.preventDefault();
    // pagereload

    setMessages((prev) => [...prev, { sender: "user", msg: textInput }]);

    try {
      //here we are requesting from the server and creating a simple fetch method
      // data/body here is textInput
      const response = await fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textInput: textInput }),
      });

      const data = await response.json();
      // erro
      console.log(data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      //set result
      setTextInput(""); //set input field to empty string

      sendBotMsg();
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const sendBotMsg = () => {
    // console.log(result, "--result");
    // show result  if data come other wise dont show data
    if (result) {
      setMessages((prev) => [...prev, { sender: "bot", msg: result }]);
      setResult("");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="form_input">
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
