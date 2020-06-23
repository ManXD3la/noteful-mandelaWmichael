import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import PropTypes from 'prop-types';
import config from '../config'
import './AddNoteForm.css'
import Cuid from 'cuid';

class AddNoteForm extends Component {
    state = {
        newNoteName: '',
        newNoteContent:'',
        newNoteFolderOwner:'',
        nameNotEmpty: false,
        conentNoteEmpty:false,
    }

    static contextType = ApiContext;

    buttonSubmit = (event) => {
        event.preventDefault();
        let whenModified = new Date(); //may need to alter
        let newNote = {
            name: event.target.elements.name.value,
            content: event.target.elements.content.value,
            folderId: event.target.elements.folderOwner.value,
            modified: whenModified
            //,id: Cuid()

        };
        console.log(newNote);

        let reqBody= JSON.stringify({'name':newNote.name,
                                    'content':newNote.content,
                                    'folderId': newNote.folderId,
                                    'modifiend': newNote.modified})
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: reqBody
        };
        fetch(`${config.API_ENDPOINT}/notes`, options)
            .then(res => {
                if(!res.ok) {
                    throw new Error(res.status)
                }
                return res.json();
            })
            .then( res => {
                this.context.newNote(res);
                this.props.history.push('/');
            })
            .then(console.log(this.context));
    }

    setName = name => {
        if (this.state.newNoteName.length >= 1) {
            this.setState({newNoteName: name, nameNotEmpty: true})
        } else {
            this.setState({newNoteName: name})
        }
    }

    setContent = content => {
        if (this.state.newNoteContent.length >= 1) {
            this.setState({newNoteContent: content, conentNoteEmpty: true})
        } else {
            this.setState({newNoteContent: content})
        }
    }

    // setFolderOwner= folderId => {
    //     this.setState({newNoteFolderOwner: folderId})
    // }

    validateNoteName = () => {
        let noteName = this.state.newNoteName;
        // let noteFolderOwner = this.state.newNoteFolderOwner
        if (noteName.length < 1) {
            return 'Name needs to at least 1 character';
        }

        // if (this.context.notes.find(note => note.name === noteName && note.folderId === noteFolderOwner)) {
        //     return 'A note with the same name already exists in this folder.';
        // }

        return ''; 
    }

    validateContent = () => {
        let noteContent = this.state.newNoteContent;
        if (noteContent.length < 1) {
            return 'Content needs at least 1 character';
        }

        return ''; 
    }
    render() {

        let folderOptions = this.context.folders.map(folder =>
                { return <option key={folder.id} value={folder.id}>{folder.name}</option>
                });

        return (
            <form onSubmit={(e) => this.buttonSubmit(e)}>
                <label htmlFor="name">Note Name:</label>
                <input type="text" name="name" id="name" value={this.state.newNoteName} onChange={e => this.setName(e.target.value)}></input><br/>
                <label htmlFor="folderOwner">Select Folder:</label>
                <select name="folderOwner" id="folder">{folderOptions}</select><br/>
                <label htmlFor="content">Note Content:</label>
                <input type="text" name="content" id="content" value={this.state.newNoteContent} onChange={e => this.setContent(e.target.value)}></input>
                <br />
                <button type="Submit" className='submitButton' disabled={this.validateNoteName() || this.validateContent()}>Submit</button>
                <div className="errorArea">
                    <p className="errorMessage">{this.validateNoteName()}</p>
                    <p className="errorMessage">{this.validateContent()}</p>
                </div>
            </form>
        )
    }

}

AddNoteForm.propTypes = {
    history: PropTypes.object.isRequired,
}

export default AddNoteForm;