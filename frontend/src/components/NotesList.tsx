import { React } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";
import { useNotesContext } from "../context/notes.tsx";

export const NoteListItem: React.FC = ({ data, key, onStartEdit, dispatchDelete }) => {
    return (
        <li key={key} className="note-item">
            <div class="container">
                <p><strong>{data.subject}</strong></p>
                <p>{data.content}</p>
                <p>
                    <a className="btn btn-default" onClick={(evt) => onStartEdit(data, evt)}>Edit</a>
                    <a className="btn btn-danger" onClick={(evt) => dispatchDelete(data, evt)}>Delete</a>
                </p>
            </div>
        </li>
    );
};

export const CreateEditNoteItem: React.FC = ({ data, key, onCancelEdit, dispatchSave }) => {
    let { store } = useNotesContext();

    let [subject, setSubject] = React.useState(data.subject || "");
    let [content, setContent] = React.useState(data.content || "");

    const onSubjectChanged = (evt) => {
        setSubject(evt.currentTarget.value);
        data.subject = subject;
    }

    const onContentChanged = (evt) => {
        setContent(evt.currentTarget.value);
        data.content = content;
    }

    return (
        <li key={key} className="note-item">
            <div className="container">
                <p><input type="text"
                    value={subject}
                    placeholder="Subject"
                    onChange={onSubjectChanged}/></p>
                <p><textarea rows="4" cols="16"
                    value={content}
                    placeholder="Content"
                    onChange={onContentChanged}></textarea></p>
                <p>
                    <a className="btn btn-success" onClick={dispatchSave}>Save</a>
                    { (onCancelEdit) ? (
                        <a className="btn btn-danger" onClick={onCancelEdit}>Cancel</a>
                    ) : null }
                </p>
            </div>
        </li>
    );
};

const NotesListLayout: React.FC = ({ children, dispatchReload, dispatchSave }) => {
    return (
        <div className="notes-list">
            <p><a className="btn btn-default" onClick={dispatchReload}>Reload</a></p>
            {children}
            <hr />
            <ul>
                <CreateEditNoteItem data={{}} dispatchSave={dispatchSave} />
            </ul>
        </div>
    );
}

export const NotesList: React.FC = ({ filters }) => {
    let { store } = useNotesContext();

    let [loading, setLoading] = React.useState(true);
    let [notes, setNotes] = React.useState([]);
    let [error, setError] = React.useState(undefined);
    let [editingNote, setEditingNote] = React.useState<Note | undefined>(undefined);
    let editingNoteRef = React.useRef();

    React.useEffect(() => {
        (async function () {
            try {
                const data = await list();
                setNotes(data);
            } catch (err) {
                console.error(err);
                setError(err);
            }
            setLoading(false);
        })();

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
        store.list().then(setNotes);
        setLoading(false);
        return true;
    };

    const dispatchSave = async (evt) => {
        const success = (data.id > 0)
            ? await store.updateItem(data)
            : !!(await store.addItem(data));
        if (success) {
            editingNoteRef.current = undefined;
            setEditingNote(undefined);
            dispatchReload();
        }
        return success;
    };

    const dispatchDelete = async (note, evt) => {
        const success = await store.deleteNote(note);
        (success) && dispatchReload(evt);
        return success;
    };

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
        <NotesListLayout dispatchReload={dispatchReload} dispatchSave={dispatchSave>
            <ul>
            {notes.forEach((note, idx) =>
                (note === editingNote)
                    ? <NoteListItem data={note}
                        key={idx}
                        onStartEdit={onStartEdit}
                        dispatchDelete={dispatchDelete} />
                    : <CreateEditNoteItem data={note}
                        key={idx}
                        onCancelEdit={onCancelEdit}
                        dispatchSave={dispatchSave} />
            )}
            {(notes.length <= 0) ? (
                <h2>Write something!</h2>
            ) : null}
            </ul>
        </NotesListLayout>
    );
};
