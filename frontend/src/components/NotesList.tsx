import { React } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";
import { useNotesContext } from "../context/notes.tsx";

interface NotesListProps {
    filters?: any;
}

export const NotesList: React.FC = ({ filters }: NotesListProps) => {
    let { store } = useNotesContext();

    let [loading, setLoading] = React.useState(false);
    let [notes, setNotes] = React.useState<Note[]>([]);
    let [error, setError] = React.useState<Error>(undefined);
    let [editingNote, setEditingNote] = React.useState<Note | undefined>(undefined);
    let editingNoteRef = React.useRef<Note | undefined>();

    React.useEffect(() => {
        dispatchReload({ });

        return () => {
            //cleanup
        }
    }, []);

    const onStartEdit = (note: Note, evt: any) => {
        editingNoteRef.current = evt.currentTarget;
        editingNoteRef.current.focus();
        setEditingNote(note);
    };

    const onCancelEdit = (evt: any) => {
        editingNoteRef.current = undefined;
        setEditingNote(undefined);
    };

    const dispatchReload = (evt: any) => {
        if (loading) {
            return false;
        }
        setLoading(true);
        (async function () {
            try {
                await doReload(evt);
            } catch (err) {
                console.error(err);
                setError(err);
            }
            setLoading(false);
        })();
        
        return true;
    };

    const dispatchSave = (note: Note, evt: any) => {
        if (loading) {
            return false;
        }
        setLoading(true);
        (async function () {
            try {
                const savedNote = (note.id > 0)
                    ? await store.updateItem(note)
                    : await store.addItem(note);
                if (!savedNote) {
                    throw new Error("failed saving note");
                }
                editingNoteRef.current = undefined;
                setEditingNote(undefined);
                await doReload(evt);
            } catch (err) {
                console.error(err);
                setError(err);
            }
            setLoading(false);
        })();
        return true;
    };

    const dispatchDelete = (note: Note, evt: any) => {
        if (loading) {
            return false;
        }
        setLoading(true);
        (async function () {
            try {
                const success = await store.deleteItem(note);
                if (!success) {
                    throw new Error("failed deleting note");
                }
                editingNoteRef.current = undefined;
                setEditingNote(undefined);
                await doReload(evt);
            } catch (err) {
                console.error(err);
                setError(err);
            }
            setLoading(false);
        })();
        return true;
    };

    const doReload = async (evt: any) => {
        setNotes(await store.list());
    }

    if (loading) {
        return (
            <NotesListLayout dispatchReload={dispatchReload} dispatchSave={dispatchSave}>
                <div className="loading">Loading...</div>
            </NotesListLayout>
        );
    }

    if (error) {
        return (
            <NotesListLayout dispatchReload={dispatchReload} dispatchSave={dispatchSave}>
                <div className="error">{error.message || `${error}`}</div>
            </NotesListLayout>
        );
    }

    return (
        <NotesListLayout dispatchReload={dispatchReload} dispatchSave={dispatchSave}>
            <ul>
                {notes.map((note: Note, idx: number) =>
                    (note === editingNote) ? (
                        <CreateEditNoteItem data={note}
                            elementKey={note.id}
                            onCancelEdit={onCancelEdit}
                            dispatchSave={dispatchSave} />
                    ) : (
                        <NoteListItem data={note}
                            elementKey={note.id}
                            onStartEdit={onStartEdit}
                            dispatchDelete={dispatchDelete} />
                    )
                )}
                {(notes.length <= 0) ? (
                    <h2>Write something!</h2>
                ) : null}
            </ul>
        </NotesListLayout>
        //<li key={note.id} className="note-item"><b>{note.subject}</b> {note.content}</li>
    )
};

interface NotesListLayoutProps {
  children: React.ReactNode;
  dispatchReload: (evt: any) => boolean;
  dispatchSave: (note: Note, evt: any) => boolean;
}

const NotesListLayout: React.FC = ({ children, dispatchReload, dispatchSave }: NotesListLayoutProps) => {
    const newNote = {
        id: 0,
        subject: "",
        content: "",
    };

    return (
        <div className="notes-list">
            <p><a className="btn btn-info" onClick={dispatchReload}>Reload</a></p>
            {children}
            <hr />
            <ul>
                <CreateEditNoteItem data={newNote} elementKey="_NEW" dispatchSave={dispatchSave} />
            </ul>
        </div>
    );
};

interface NotesListItemProps {
    data: Note;
    elementKey?: string;
    onStartEdit: (note: Note, evt: any) => boolean;
    dispatchDelete: (note: Note, evt: any) => boolean;
}
  
export const NoteListItem: React.FC = ({ data, elementKey, onStartEdit, dispatchDelete }: NotesListItemProps) => {
    return (
        <li key={elementKey} className="note-item">
            <div className="container">
                <input type="hidden" name="note_id" value={data.id} />
                <p><strong>{data.subject}</strong></p>
                <p>{data.content}</p>
                <p>
                    <a className="btn btn-info" onClick={(evt: any) => onStartEdit(data, evt)}>Edit</a>
                    <a className="btn btn-danger" onClick={(evt: any) => dispatchDelete(data, evt)}>Delete</a>
                </p>
            </div>
        </li>
    )
};

interface CreateEditNoteItemProps {
    data: Note;
    elementKey?: string;
    onCancelEdit?: (evt: any) => boolean;
    dispatchSave: (evt: any) => boolean;
}
  
export const CreateEditNoteItem: React.FC = ({ data, elementKey, onCancelEdit, dispatchSave }: CreateEditNoteItemProps) => {
    let { store } = useNotesContext();

    let [subject, setSubject] = React.useState(data.subject || "");
    let [content, setContent] = React.useState(data.content || "");

    const onSubjectChanged = (evt: any) => {
        setSubject(evt.currentTarget.value);
    }

    const onContentChanged = (evt: any) => {
        setContent(evt.currentTarget.value);
    }

    const onSaveBtnClicked = (evt: any) => {
        data = { ...data, subject, content };
        if (dispatchSave(data, evt)) {
            if (data.id <= 0) {
                setSubject("");
                setContent("");
            }
        }
    }

    return (
        <li key={elementKey} className="note-item">
            <div className="container">
                <input type="hidden" name="note_id" value={data.id} />
                <p><input type="text"
                    name="note_subject"
                    value={subject}
                    placeholder="Subject"
                    onChange={onSubjectChanged} /></p>
                <p><textarea rows="4" cols="16"
                    name="note_content"
                    value={content}
                    placeholder="Content"
                    onChange={onContentChanged}></textarea></p>
                <p>
                    <a className="btn btn-success" onClick={onSaveBtnClicked}>Save</a>
                    {(onCancelEdit) ? (
                        <a className="btn btn-danger" onClick={onCancelEdit}>Cancel</a>
                    ) : null}
                </p>
            </div>
        </li>
    );
};
