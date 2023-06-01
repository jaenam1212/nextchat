import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export default function TextEditor() {
  const ydocRef = useRef(null);
  const ytextRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    ydocRef.current = new Y.Doc();
    ytextRef.current = ydocRef.current.getText("shared-text");

    new WebrtcProvider("my-room-name", ydocRef.current, {
      signaling: [
        "wss://my-signaling-server.com",
        "wss://my-other-signaling-server.com",
      ],
    });

    ydocRef.current.on("update", () => {
      setText(ytextRef.current.toString());
    });

    return () => {
      ydocRef.current.destroy();
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    ytextRef.current.delete(0, ytextRef.current.length);
    ytextRef.current.insert(0, newText);
  };

  return (
    <div>
      <textarea value={text} onChange={handleTextChange} />
    </div>
  );
}
