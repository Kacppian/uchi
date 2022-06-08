import React from "react";
import "./index.css";

const StatusBar = ({}) => {
  return (
    <div className="actions-container bg-white flex items-center justify-between px-4">
      <div className="avatar-container">
        <img src="https://i.pravatar.cc/300" />
      </div>
      <div className="icon-container">
        <img src="https://img.icons8.com/ios-glyphs/60/undefined/share--v1.png" />
      </div>
      <div className="icon-container">
        <img src="https://img.icons8.com/ios-glyphs/60/undefined/filled-chat.png" />
      </div>
    </div>
  );
};

export default StatusBar;
