import { useState, useCallback } from "react";
export default function useToggleDialog(){
  const [visible, setVisible] = useState(false);

  const toggleDialog = useCallback(() => setVisible((previous) => !previous), []);

  return [visible, toggleDialog];
}