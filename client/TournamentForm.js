import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class TournamentForm extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            name: '',
            bracketUrl: '',
            game: ''
        }

        this.handleFormInputChange = this.handleFormInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFormInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        this.createPlayer();
        this.clearForm();
        event.preventDefault();
    }

    render(){
        return (
            <div>
                <h4>Tournament Info</h4>
                <form>
                    <table>
                        <tr>
                            <td><label>Name: </label></td>
                            <td>
                                <input type='text' name='name' required
                                    class='form-control'
                                    onChange={this.handleFormInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Game: </label></td>
                            <td>
                                <select name='game' required class='form-control'
                                    onChange={this.handleFormInputChange}>
                                    <option>Select One</option>
                                    <option>Melee</option>
                                    <option>Smash 4</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Bracket URL: </label></td>
                            <td>
                                <input type='text' name='bracket' class='form-control'
                                    onChange={this.handleFormInputChange} />
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        )
    }
}