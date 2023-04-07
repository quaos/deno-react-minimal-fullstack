import React, { DynamicComponent, useEffect, useState } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";
import { NoteAction, NoteCreateEditItem } from "./NoteCreateEditItem.tsx";

const createNewNote = (): Note => ({
  id: 0,
  subject: "",
  content: "",
});

export interface NotesListLayoutProps {
  Component: DynamicComponent;
  isBusy: boolean;
  isSaving: boolean;
  reload: (evt: React.SyntheticEvent) => void;
  saveNewNote: NoteAction;
}

export const NotesListLayout = (
  { Component = "ul", children, isBusy, isSaving, reload, saveNewNote }:
    React.PropsWithChildren<NotesListLayoutProps>,
) => {
  const [newNote, setNewNote] = useState(createNewNote());

  useEffect(() => {
    if (!isSaving) {
      // Clear new note after saved to list
      setNewNote(createNewNote());
    }
  }, [isSaving]);

  return (
    <div className="notes-list">
      <p>
        <button className="btn btn-info" onClick={reload}>Reload</button>
      </p>
      {children}
      <hr />
      <Component>
        <NoteCreateEditItem
          data={newNote}
          isDisabled={isBusy || isSaving}
          save={saveNewNote}
        />
      </Component>
    </div>
  );
};
