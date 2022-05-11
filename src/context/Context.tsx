import React, { useState } from "react";

interface IContext {
  demoContext: string;
  setDemoContext: (text: string) => void;

  authed: boolean;
  setAuthed: (isAuthed: boolean) => void;
}

export const Context = React.createContext<IContext | undefined>(
  undefined
)

export const ContextProvider: React.FC = (props) => {
  const [demoContext, setDemoContext] = useState<string>('demo');
  const [authed, setAuthed] = useState<boolean>(false);

  return (
    <Context.Provider
      value={{
        demoContext: demoContext,
        setDemoContext: setDemoContext,
        authed: authed,
        setAuthed: setAuthed
      }}
    >
      {props.children}
    </Context.Provider>
  );
};