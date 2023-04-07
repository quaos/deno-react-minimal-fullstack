import React, { WithDynamicComponent } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";

export type NoteAction = (note: Note, evt: React.SyntheticEvent) => void;

export interface NotesListItemProps {
  data: Note;
  startEdit: NoteAction;
  deleteNote: NoteAction;
}

export const NotesListItem = (
  { Component = "li", data, startEdit, deleteNote }: WithDynamicComponent<
    NotesListItemProps
  >,
) => {
  return (
    <Component className="note-item">
      <div className="container">
        <input type="hidden" name="note_id" value={data.id} />
        <p>
          <strong>{data.subject}</strong>
        </p>
        <p>{data.content}</p>
        <p>
          <button
            className="btn btn-info"
            onClick={(evt) => startEdit(data, evt)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={(evt) => deleteNote(data, evt)}
          >
            Delete
          </button>
        </p>
      </div>
    </Component>
  );
};
