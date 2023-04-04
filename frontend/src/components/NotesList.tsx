import React, {
  useEffect,
  useRef,
  useState,
  WithDynamicComponent,
} from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";
import { useNotesContext } from "../context/notes-store.tsx";
import { NoteCreateEditItem } from "./NoteCreateEditItem.tsx";
import { NotesListItem } from "./NotesListItem.tsx";
import { NotesListLayout } from "./NotesListLayout.tsx";

export interface NotesListProps {
  filters?: Record<string, any>;
}

export const NotesList = (
  { Component }: WithDynamicComponent<NotesListProps>,
) => {
  const { store } = useNotesContext();

  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isBusy = isLoading || isSaving || isDeleting;

  const editingNoteElRef = useRef<HTMLElement | undefined>();

  React.useEffect(() => {
    dispatchReload();

    return () => {
      //cleanup
    };
  }, []);

  const onStartEdit = (note: Note, evt: React.SyntheticEvent) => {
    setEditingNote(note);
    editingNoteElRef.current = evt.currentTarget as HTMLElement;
    if (editingNoteElRef.current) {
      editingNoteElRef.current.focus();
    }
  };

  const onCancelEdit = (evt: React.SyntheticEvent) => {
    editingNoteElRef.current = undefined;
    setEditingNote(undefined);
  };

  const dispatchReload = (evt?: React.SyntheticEvent) => {
    if (isBusy) {
      return false;
    }
    (async function () {
      try {
        setIsLoading(true);
        await doReload(evt);
      } catch (err) {
        console.error(err);
        setError(err);
      }
      setIsLoading(false);
    })();

    return true;
  };

  const dispatchSave = (note: Note, evt: React.SyntheticEvent) => {
    if (isBusy) {
      return false;
    }
    (async function () {
      try {
        setIsSaving(true);
        const savedNote = (note.id > 0)
          ? await store.updateItem(note)
          : await store.addItem(note);
        if (!savedNote) {
          throw new Error("failed saving note");
        }
        editingNoteElRef.current = undefined;
        setEditingNote(undefined);
        await doReload(evt);
      } catch (err) {
        console.error(err);
        setError(err);
      }
      setIsSaving(false);
    })();
    return true;
  };

  const dispatchDelete = (note: Note, evt: React.SyntheticEvent) => {
    if (isBusy) {
      return false;
    }
    (async function () {
      try {
        setIsDeleting(true);
        const success = await store.deleteItem(note);
        if (!success) {
          throw new Error("failed deleting note");
        }
        editingNoteElRef.current = undefined;
        setEditingNote(undefined);
        await doReload(evt);
      } catch (err) {
        console.error(err);
        setError(err);
      }
      setIsDeleting(false);
    })();
    return true;
  };

  const doReload = async (_evt?: React.SyntheticEvent) => {
    setNotes(await store.list());
  };

  if (isLoading) {
    return (
      <NotesListLayout
        Component={Component as any}
        isBusy={isBusy}
        isSaving={isSaving}
        reload={dispatchReload}
        saveNewNote={dispatchSave}
      >
        <div className="loading">Loading...</div>
      </NotesListLayout>
    );
  }

  if (error) {
    return (
      <NotesListLayout
        Component={Component as any}
        isBusy={isBusy}
        isSaving={isSaving}
        reload={dispatchReload}
        saveNewNote={dispatchSave}
      >
        <div className="error">{error.message || `${error}`}</div>
      </NotesListLayout>
    );
  }

  return (
    <NotesListLayout
      Component={Component as any}
      isBusy={isBusy}
      isSaving={isSaving}
      reload={dispatchReload}
      saveNewNote={dispatchSave}
    >
      <ul>
        {notes.map((note) =>
          note === editingNote
            ? (
              <NoteCreateEditItem
                key={note.id}
                data={note}
                isDisabled={isBusy}
                cancelEdit={onCancelEdit}
                save={dispatchSave}
              />
            )
            : (
              <NotesListItem
                key={note.id}
                data={note}
                startEdit={onStartEdit}
                deleteNote={dispatchDelete}
              />
            )
        )}
        {(notes.length <= 0) ? <h2>Write something!</h2> : null}
      </ul>
    </NotesListLayout>
    //<li key={note.id} className="note-item"><b>{note.subject}</b> {note.content}</li>
  );
};
