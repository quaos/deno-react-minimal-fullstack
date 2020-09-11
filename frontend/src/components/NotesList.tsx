import { React } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";
import { NotesContext } from "../context/notes.tsx";

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

export const CreateEditNoteItem: React.FC = ({ data, onCancelEdit, dispatchReload }) => {
    let { addNote, updateNote } = React.useContext(NotesContext);

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

    const dispatchSave = async (evt) => {
        const success = (data.id > 0)
            ? await updateNote(data)
            : !!(await addNote(data));
        (success) && dispatchReload();
        return success;
    };

    return (
        <li className="note-item">
            <div className="container">
                <p><input
                    value={subject}
                    placeholder="Subject"
                    onChange={onSubjectChanged}/></p>
                <p><textarea rows="4" cols="16"
                    placeholder="Content"
                    onChange={onContentChanged}>{content}</textarea></p>
                <p>
                    <a className="btn btn-success" onClick={dispatchSave}>Save</a>
                    { (onCancelEdit)
                        ? <a className="btn btn-danger" onClick={onCancelEdit}>Cancel</a>
                        : ()
                    }
                </p>
            </div>
        </li>
    );
};

export const NotesList: React.FC = ({ filters }) => {
    let { list, deleteNote } = React.useContext(NotesContext);

    let [loading, setLoading] = React.useState(true);
    let [notes, setNotes] = React.useState([]);
    let [error, setError] = React.useState(undefined);
    let [editingNote, setEditingNote] = React.useState<Partial<Note>>({});
    let editingNoteRef = React.useRef();

    React.useEffect(() => {
        (async function () {
            setNotes(await list());
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
        setEditingNote({});
    };

    const dispatchReload = (evt: any) => {
        if (loading) {
            return false;
        }
        setLoading(true);
        list().then(setNotes);
        setLoading(false);
        return true;
    };

    const dispatchDelete = async (note, evt) => {
        const success = await deleteNote(note);
        (success) && dispatchReload(evt);
        return success;
    };

    return (
        <div className="notes-list">
            <p><a className="btn btn-default" onClick={dispatchReload}>Reload</a></p>
            {(loading)
                ? (
                    <div className="loading">Loading...</div>
                )
                : (
                    <ul>
                    {notes.forEach((note, idx) => (
                        {(note === editingNote)
                            ? <NoteListItem data={note}
                                key={idx}
                                onStartEdit={onStartEdit}
                                dispatchDelete={dispatchDelete} />
                            : <CreateEditNoteItem data={note}
                                onCancelEdit={onCancelEdit}
                                dispatchReload={dispatchReload} />}
                    ))}
                    </ul>
                )}
            <ul>
                <CreateEditNote data={{}} dispatchReload={dispatchReload} />
            </ul>
        </div>
    );
};
