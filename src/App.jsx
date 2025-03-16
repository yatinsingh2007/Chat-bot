import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import {Bot} from 'lucide-react'
import "./App.css";
function App() {
  const [resp, setResp] = useState([]);
  const [present, setPresent] = useState(false);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPresent(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [present]);
  const geminiKey = import.meta.env.VITE_GEMINI_API
  const chat = (event) => {
    event.preventDefault();

    if (inputValue.trim() === "") {
      setPresent(true);
      setInputValue("");
      return;
    }
    setResp((prev) => [...prev, inputValue]);
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: inputValue,
                },
              ],
            },
          ],
        }),
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        setResp((prev) => [...prev, data.candidates[0].content.parts[0].text]);
      })
      .catch((error) => {
        console.log(error);
      });

    setInputValue("");
  };
  return (
    <>
      <div className="min-h-screen bg-[#B39DDB] flex flex-col items-center p-5 overflow-y-auto">
        <h1 className="text-center font-mono text-5xl text-white">Chat-Bot</h1>
        <span className="text-white">v-0.0.0.1</span>
        <Bot className="w-14 h-14 mt-4"/>
        <div className="flex flex-col justify-between items-center p-7 w-full max-w-md">
          <div className="bg-[#A7C7E7] h-[600px] w-[600px] overflow-auto p-3 rounded-md shadow-lg flex flex-col">
          {resp?.map((item, indx) => (
          <span key={indx} className={`m-3 rounded-lg p-2 max-w-[80%] 
            ${indx % 2 === 0 ? "bg-white self-end text-black" : "bg-cyan-800 self-start text-white"}`}>
            {indx % 2 === 0 ? <span>{item}</span> : <Markdown>{item}</Markdown>}
          </span>
        ))}
          </div>
          <form className="w-full mt-3 flex gap-5" onSubmit={chat}>
            <input
              type="text"
              placeholder="Enter Your Message Here"
              className="w-full rounded-bl-3xl rounded-tl-3xl rounded-tr-lg rounded-br-lg p-2 outline-none border border-gray-400 shadow-sm text-gray-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">
              <span className="material-symbols-outlined p-1">send</span>
            </button>
          </form>
        </div>
      </div>
      {present && (
        <div className="w-screen bg-white text-red-600 p-3">
          ALERT:- Enter Something in The Input Field
        </div>
      )}
    </>
  );
}
export default App;