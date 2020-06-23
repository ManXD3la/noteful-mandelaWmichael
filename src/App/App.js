import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import Cuid from 'cuid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolderForm from '../AddFolder/AddFolderForm';
import AddNoteForm from  '../AddNote/AddNoteForm';
import ApiContext from '../ApiContext';
import config from '../config';
import AppError from '../AppError';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: [{name:'example one',id:1},{name:'example two',id:2}],
        foundError: false
    };


    newFolder = (folder) => {
        //const newFolder = {name: folder, id: Cuid()}
        const newFoldersState = [...this.state.folders, folder];
        this.setState({
            folders: newFoldersState
        })

        
    };

    newNote = (note) => {
        const newNotesState = [...this.state.notes, note];
        this.setState({
            notes: newNotesState
        })
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    };

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-folder" component={AddFolderForm} />
                <Route path="/add-note" component={AddNoteForm} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            onFolderForm: this.state.onFolderForm,
            onNoteForm: this.state.onNoteForm,
            newFolder: this.newFolder,
            newNote: this.newNote,
            deleteNote: this.handleDeleteNote
        };

        if(this.state.foundError) {
            throw new Error('Error Detected')
        }
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <AppError>
                        <nav className="App__nav">{this.renderNavRoutes()}</nav>
                        <header className="App__header">
                            <h1>
                                <Link to="/">Noteful</Link>{' '}
                                <FontAwesomeIcon icon="check-double" />
                            </h1>
                        </header>
                        <main className="App__main">{this.renderMainRoutes()}</main>
                    </AppError>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;
