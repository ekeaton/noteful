import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import Note from "./components/Note";
import Noteful from "./components/Noteful";
import NotefulContext from "./NotefulContext";
import "./App.css";
import AddFolder from "./components/AddFolder";
import AddNote from "./components/AddNote";
import ErrorBoundary from "./ErrorBoundary";
import config from './config';


class App extends React.Component {
  state = {
    folders: [],
    notes: []
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/folders`),
            fetch(`${config.API_ENDPOINT}/api/notes`)
    ])
      .then(([folderRes, noteRes]) => {
        if (!folderRes.ok) return folderRes.json().then(e => Promise.reject(e));
        if (!noteRes.ok) return noteRes.json().then(e => Promise.reject(e));

        return Promise.all([folderRes.json(), noteRes.json()]);
      })
      .then(([folders, notes]) => {
        this.setState({
          folders
        });
        this.setState({
          notes
        });
      })

      .catch(error => {
        console.error({ error });
      });
  }

  addFolderHandle = folder => {
    this.setState({
      folders: [...this.state.folders, folder]
    });
  };

  addNoteHandle = note => {
    this.setState({
      notes: [...this.state.notes, note]
    });
  };

  removeNoteHandle = id => {
    let updatedNotes = this.state.notes.filter(note => note.id !== id);
    this.setState({
      notes: updatedNotes
    });
  };


  render() {
    const contextValue = {
      folders: this.state.folders,
      notes: this.state.notes,
      removeNote: this.removeNoteHandle,
      addFolder: this.addFolderHandle,
      addNote: this.addNoteHandle,
    
    };
    return (
      <NotefulContext.Provider value={contextValue}>
        <div className="App">
          <header>
            <h2>
              {" "}
              <Link to={"/"}>Noteful</Link>
            </h2>
          </header>
          <main>
            <Switch>
              <ErrorBoundary>
                <Route exact path="/" component={Noteful} />
                <Route path="/folder/:folderId" component={Noteful} />
                <Route path="/note/:noteId" component={Note} />
                <Route path="/add-folder" exact component={AddFolder} />
                <Route path="/add-note" exact component={AddNote} />
              </ErrorBoundary>
            </Switch>
          </main>
        </div>
      </NotefulContext.Provider>
    );
  }
}

export default App;

