import React, { useState } from "react";

interface IContext {
  demoContext: string;
  setDemoContext: (text: string) => void;

  authed: boolean;
  setAuthed: (isAuthed: boolean) => void;

  authedUserUid: string;
  setAuthedUserUid: (uid: string) => void;
}

export const Context = React.createContext<IContext | undefined>(
  undefined
)

export const ContextProvider: React.FC = (props) => {
  const [demoContext, setDemoContext] = useState<string>('demo');
  const [authed, setAuthed] = useState<boolean>(false);
  const [authedUserUid, setAuthedUserUid] = useState<string>('');

  return (
    <Context.Provider
      value={{
        demoContext: demoContext,
        setDemoContext: setDemoContext,
        authed: authed,
        setAuthed: setAuthed,
        authedUserUid: authedUserUid,
        setAuthedUserUid: setAuthedUserUid
      }}
    >
      {props.children}
    </Context.Provider>
  );
};