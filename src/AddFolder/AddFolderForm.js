import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import PropTypes from 'prop-types';
import config from '../config'
import './AddFolderForm.css'

class AddFolderForm extends Component {
    state = {
        newFolderName: '',
        nameNotEmpty: false
    }

    static contextType = ApiContext;

    buttonSubmit = (event) => {
        event.preventDefault();
        let name = event.target.elements.name.value;
        console.log(name)

        let reqBody= JSON.stringify({'name':name})
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: reqBody
        };
        fetch(`${config.API_ENDPOINT}/folders`, options)
            .then(res => {
                if(!res.ok) {
                    throw new Error(res.status)
                }
                return res.json();
            })
            .then( res => {
                this.context.newFolder(res);
                this.props.history.push('/');
            })
            .then(console.log(this.context));
    }

    setName = name => {
        if (this.state.newFolderName.length >= 1) {
            this.setState({newFolderName: name, nameNotEmpty: true})
        } else {
            this.setState({newFolderName: name})
        }
    }

    validateFolderName = () => {
        let folderName = this.state.newFolderName;
        if (folderName.length < 1) {
            return 'Name needs to at least 1 character';
        }

        if (this.context.folders.find(folder => folder.name === folderName)) {
            return 'This Folder Name already exists.';
        }

        return ''; 
    }

    render() {
        return (
            <form onSubmit={(e) => this.buttonSubmit(e)}>
                <label htmlFor="name">Folder Name:</label>
                <input type="text" name="name" id="name" value={this.state.newFolderName} onChange={e => this.setName(e.target.value)}></input>
                <br />
                <button type="Submit" className='submitButton' disabled={this.validateFolderName()}>Submit</button>
                <div className="errorArea">
                    <p className="errorMessage">{this.validateFolderName()}</p>
                </div>
            </form>
        )
    }

}

AddFolderForm.propTypes = {
    history: PropTypes.object.isRequired,
}

export default AddFolderForm;