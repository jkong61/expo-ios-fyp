import { useState } from "react";

export default function useDialogHandler(toggleCallback){
  const [errorDialogContent, setErrorDialogContent] = useState({
    title: "",
    content: ""
  });

  function toggle(content){
    setErrorDialogContent({
      title: content.title ?? "No Info",
      content: content.message ?? "No Info"
    });
    toggleCallback();
  }

  return [errorDialogContent, toggle];
}