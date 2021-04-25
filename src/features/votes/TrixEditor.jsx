import React from "react";
import { TrixEditor } from "react-trix";

export const Editor =({ content, send}) => {

// const handleEditorReady = (editor) => {
//   // this is a reference back to the editor if you want to
//   // do editing programatically
//   // editor.insertString("");
// }

const handleChange = html => send({
    type: 'TYPED',
    payload: { content: html },
  })
  


  return ( 
   <TrixEditor 
    toolbar=""
    className="tl shadow-sm focus:ring-light-blue-500 focus:border-light-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md mb-20 p-5 h-40 bg-white" 
    autoFocus={true} 
    placeholder="editor's placeholder" 
    value={content} 
    onChange={(html, text) => handleChange(html, text)} 
    // onEditorReady={(editor) => handleEditorReady(editor)} 
  />);
}
  