import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine, RiGamepadLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios"; 

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const gameRef = useRef();
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [gamePickerOpen, setGamePickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        gameRef.current &&
        !gameRef.current.contains(event.target) &&
        emojiRef.current &&
        !emojiRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false);
        setGamePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef, gameRef]);

  

  const handleChessStart = async () => {
    try {
      // Check if sender and recipient are set
      if (selectedChatData && userInfo) {
        const chessGameLink = "https://chess.gain.gg/";
        const messageContent = `A chess game has started! [Click here to join](${chessGameLink}).`;
  
        // Send the game start message first
        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: messageContent,
          recipient: selectedChatData._id,
          messageType: "text",
        });
  
        // Then, create the game entry
        const response = await apiClient.post(
          "/api/games", // Ensure this matches your backend route
          {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            gameName: "Chess",
          },
          { withCredentials: true }
        );
  
        if (response.status === 201) {
          console.log("Game information stored successfully:", response.data);
          // Handle any additional state updates or notifications if needed
        }
      }
    } catch (error) {
      console.log("Failed to store game information:", error);
    }
  };
  

  

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      console.log({ file });
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const toggleGamePicker = () => {
    setGamePickerOpen(!gamePickerOpen);
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md item-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        ></input>
        <div className="relative">
          <button
            className="h-0 text-neutral-500 focus:border-none 
                focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>

        <div className="relative">
          <button
            className="h-0 text-neutral-500 focus:border-none 
    focus:outline-none focus:text-white duration-300 transition-all"
            onClick={toggleGamePicker}
          >
            <RiGamepadLine className="text-2xl" />
          </button>
          {gamePickerOpen && (
            <div
              className="absolute bottom-full mb-2 right-0 bg-[#2a2b33] p-4 rounded-md"
              ref={gameRef}
            >
              <a
                href="https://chess.gain.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
                onClick={(event) => {
                  event.stopPropagation(); // Prevents the dropdown from closing
                  handleChessStart(); // Sends the message
                }}
              >
                Chess
              </a>
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5  focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
