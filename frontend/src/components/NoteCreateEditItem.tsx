import React, {
  useEffect,
  useRef,
  useState,
  WithDynamicComponent,
} from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";

export type CancelAction = (evt: React.SyntheticEvent) => void;
export type NoteAction = (note: Note, evt: React.SyntheticEvent) => void;

export interface NoteCreateEditItemProps {
  data: Note;
  isDisabled?: boolean;
  cancelEdit?: CancelAction;
  save: NoteAction;
}

export const NoteCreateEditItem = (
  { Component = "li", data, isDisabled, cancelEdit, save }:
    WithDynamicComponent<NoteCreateEditItemProps>,
): JSX.Element => {
  const [editingNote, setEditingNote] = useState(data);

  useEffect(() => {
    setEditingNote({ ...data });
  }, [data]);

  const onFieldChanged = (
    key: keyof Note,
    evt: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setEditingNote({
      ...editingNote,
      [key]: evt.currentTarget.value,
    });
  };

  const onSaveBtnClicked = (evt: React.MouseEvent) => {
    save(editingNote, evt);
  };

  return (
    <Component className="note-item">
      <div className="container">
        <input type="hidden" name="note_id" value={data.id} />
        <p>
          <input
            type="text"
            name="note_subject"
            value={editingNote.subject ?? ""}
            disabled={isDisabled}
            placeholder="Subject"
            onChange={(evt) => onFieldChanged("subject", evt)}
          />
        </p>
        <p>
          <textarea
            rows={4}
            cols={16}
            name="note_content"
            value={editingNote.content ?? ""}
            disabled={isDisabled}
            placeholder="Content"
            onChange={(evt) => onFieldChanged("content", evt)}
          >
          </textarea>
        </p>
        <p>
          <button
            className="btn btn-success"
            disabled={isDisabled}
            onClick={onSaveBtnClicked}
          >
            Save
          </button>
          {(cancelEdit)
            ? (
              <button
                className="btn btn-danger"
                disabled={isDisabled}
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )
            : null}
        </p>
      </div>
    </Component>
  );
};
