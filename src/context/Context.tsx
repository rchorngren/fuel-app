import React, { useState } from "react";

interface IContext {
  authed: boolean;
  setAuthed: (isAuthed: boolean) => void;

  authedUserUid: string;
  setAuthedUserUid: (uid: string) => void;

  availableTanks: any;
  setAvailableTanks: (tanks: any) => void;
}

export const Context = React.createContext<IContext | undefined>(
  undefined
)

export const ContextProvider: React.FC = (props) => {
  const [authed, setAuthed] = useState<boolean>(false);
  const [authedUserUid, setAuthedUserUid] = useState<string>('');
  const [availableTanks, setAvailableTanks] = useState<any>([]);

  return (
    <Context.Provider
      value={{
        authed: authed,
        setAuthed: setAuthed,
        authedUserUid: authedUserUid,
        setAuthedUserUid: setAuthedUserUid,
        availableTanks: availableTanks,
        setAvailableTanks: setAvailableTanks
      }}
    >
      {props.children}
    </Context.Provider>
  );
};