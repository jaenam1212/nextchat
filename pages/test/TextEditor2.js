import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/router";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

const modules = {
  toolbar: {
    container: "#toolbar",
  },
};

const TextEditor = () => {
  const [editorState, setEditorState] = useState("");
  const quillRef = useRef();
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (quillRef.current) {
      // Get the Quill instance
      const quill = quillRef.current.getEditor();

      // Yjs setup
      const ydoc = new Y.Doc();
      const ytext = ydoc.getText("quill");
      const provider = new WebrtcProvider(roomId, ydoc);

      // Binding Quill instance to Yjs
      const binding = new QuillBinding(ytext, quill);

      // Sync Yjs updates to state
      ytext.observe(() => {
        setEditorState(quill.getContents());
      });
    }
  }, []);

  const handleTextChange = (content, delta, source, editor) => {
    // Only emit changes done by the user, not by our Yjs listener
    if (source === "user") {
      setEditorState(content);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "10px",
            height: "80vh",
            width: "75%",
            cursor: "text",
          }}
        >
          {process.browser && (
            <ReactQuill
              ref={quillRef}
              value={editorState}
              onChange={handleTextChange}
              modules={modules}
              style={{ height: "100%" }} // Set editor height to fill its container
            />
          )}
        </div>
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            height: "80vh",
            width: "20%",
          }}
        >
          <h2>TEXT</h2>
          <hr />
          <div id="toolbar">
            <button className="ql-bold">Bold</button>
            <button className="ql-italic">Italic</button>
            <button className="ql-underline">Underline</button>
            <button className="ql-strike">Strike</button>
            <select className="ql-header">
              <option value="1">Header 1</option>
              <option value="2">Header 2</option>
              <option value="">Normal</option>
            </select>
            <button className="ql-align" value="" />
            <button className="ql-align" value="center" />
            <button className="ql-align" value="right" />
            <button className="ql-align" value="justify" />
            <button className="ql-list" value="bullet" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="check" />
            <button className="ql-blockquote" />
            <button className="ql-undo" />
            <button className="ql-redo" />
          </div>
        </div>
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default TextEditor;
