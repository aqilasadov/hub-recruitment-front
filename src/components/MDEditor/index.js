import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import MDEditorRoot from "components/MDEditor/MDEditorRoot";
import { useMaterialUIController } from "context";

function MDEditor({ value = "", onChange }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const blocksFromHTML = convertFromHTML(value || "");
  const contentState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(contentState)
  );

  useEffect(() => {
    const html = convertToHTML(editorState.getCurrentContent());
    if (typeof onChange === "function") {
      onChange(html); // formik-ə ötür
    }
  }, [editorState]);

  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        editorStyle={{
          minHeight: "200px",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "6px",
          backgroundColor: darkMode ? "#1A2035" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      />
    </MDEditorRoot>
  );
}

MDEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MDEditor;
