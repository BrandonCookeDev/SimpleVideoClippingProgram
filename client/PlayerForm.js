import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {find} from 'lodash'

export default class PlayerForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            players: [],
            tag: '',
            character: '',
            color: '',
            error: ''
        }

        this.clearForm = this.clearForm.bind(this);
        this.createPlayer = this.createPlayer.bind(this);
        this.handleFormInputChange = this.handleFormInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    clearForm(){
        document.getElementById('newPlayerForm').reset();
        this.setState(prevState => ({
            tag: '',
            character: '',
            color: ''
        }))
    }

    createPlayer(){
        try{
            var character = new Character(this.state.character, this.state.color);
            character.validateCharacter()
            var player = new Player(this.state.tag, character);

            var playerExists = _.find(this.state.players, {tag: this.state.tag});
            if(!playerExists){
                this.setState(prevState => {
                    prevState.players.push(player)
                    return{
                        players: prevState.players
                    }
                });
            }
            else{
                throw new Error('Player ' + this.state.tag + ' already added');
            }

        } catch(e){
            this.setState(prevState => ({
                error: e.message
            }))
        }
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

        var characterData = CharacterList.getData();
        var characterSelected = characterData.filter((o) => o.Name === this.state.character);
        var colorOptions = characterSelected.length > 0 ? 
            characterSelected[0].Colors.map(x => <option>{x}</option>) : [];   
        var playerRows = this.state.players.map(
            x => 
                <tr>
                    <td><label>{x.tag}</label></td>
                    <td><label>{x.character.name}</label></td>
                    <td><label>{x.character.color}</label></td>
                </tr>
            )

        //{CharacterList.getData()[this.state.character][Colors].map(x => <option>{x}</option>)}
                           
        return(
            <div>
                <h4>Add Player to Match</h4>
                <form onSubmit={this.handleSubmit} id="newPlayerForm">
                    <label class="errorLabel" >{this.state.error}</label>
                    <table>
                        <tr>
                            <td><label>Tag: </label></td>
                            <td> 
                                <input type='text' onChange={this.handleFormInputChange} required
                                    placeholder='xxxGrinder69mlgnoscopes' 
                                    name='tag' length="100" class='form-control'/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Character: </label></td>
                            <td>
                                <select onChange={this.handleFormInputChange} 
                                    name='character' class='form-control'>
                                    <option>Select One</option>
                                    {characterData.map(x => <option>{x.Name}</option>)}
                                </select>
                            </td>
                        </tr>   
                        <tr>
                            <td><label>Color: </label></td>
                            <td>
                                <select onChange={this.handleFormInputChange} 
                                    name='color' class='form-control'>  
                                    <option>Select One</option>
                                    {colorOptions}  
                                </select>
                            </td>
                        </tr>
                    </table>
                    <input type='submit' value='Add Player' class='btn-success' />
                </form>
                
                <br/>
                <h4>Players</h4>
                <form>
                    <tr>
                        <th>Tag</th>
                        <th>Character</th>
                        <th>Color</th>
                    </tr>
                    {playerRows}
                </form>
            </div>
        )
    }
}

class PlayerTable extends Component{


    render(){
        return (
            <div>
                
            </div>
        )
    }
}

class Player{
    constructor(tag, character){
        this.tag = tag;
        this.character = character;
    }
}

class Character{
    constructor(name, color){
        this.name = name;
        this.color = color;

        this.validateCharacter = this.validateCharacter.bind(this);
    }

    validateCharacter(){
        let data = CharacterList.getData();
        let character = _.find(data, {"Name": this.name});
        if(!character)
            throw new Error('No character named ' + this.name);

        let characterColor = character.Colors.includes(this.color);
        if(!characterColor)
            throw new Error(this.color + ' is not a color for ' + this.name);
        
        return true;
    }
}

class CharacterList{
    static getData(){
        return [
            {
                "Name": "Bowser",
                "Colors": [
                    "Neutral",
                    "Black",
                    "Blue",
                    "Red"
                ]
            },
            {
                "Name": "Donkey Kong",
                "Colors": [
                    "Neutral",
                    "Black",
                    "Blue",
                    "Green",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Dr. Mario",
                "Colors": [
                    "Neutral",
                    "Black",
                    "Green",
                    "Blue",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Falco",
                "Colors": [
                    "Neutral",
                    "Red",
                    "Green",
                    "Blue"
                ]
            }
            ,
            {
                "Name": "Captain Falcon",
                "Colors": [
                    "Neutral",
                    "Red",
                    "Blue",
                    "Green",
                    "Pink",
                    "Black"
                ]
            }
            ,
            {
                "Name": "Fox",
                "Colors": [
                    "Neutral",
                    "Green",
                    "Blue",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Mr. Game and Watch",
                "Colors": [
                    "Neutral",
                    "Blue",
                    "Green",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Ganondorf",
                "Colors": [
                    "Neutral",
                    "Blue",
                    "Purple",
                    "Green",
                    "Blue",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Ice Climbers",
                "Colors": [
                    "Neutral",
                    "Orange",
                    "Red",
                    "Green"
                ]
            }
            ,
            {
                "Name": "Kirby",
                "Colors": [
                    "Neutral",
                    "White",
                    "Blue",
                    "Green",
                    "Red",
                    "Yellow"
                ]
            }
            ,
            {
                "Name": "Link",
                "Colors": [
                    "Neutral",
                    "White",
                    "Black",
                    "Red",
                    "Blue"
                ]
            }
            ,
            {
                "Name": "Luigi",
                "Colors": [
                    "Neutral",
                    "Blue",
                    "White",
                    "Pink"
                ]
            }
            ,
            {
                "Name": "Mario",
                "Colors": [
                    "Neutral",
                    "Yellow",
                    "Black",
                    "Green",
                    "Blue"
                ]
            }
            ,
            {
                "Name": "Marth",
                "Colors": [
                    "Neutral",
                    "White",
                    "Black",
                    "Green",
                    "Red"
                ]
            }
            ,
            {
                "Name": "MewTwo",
                "Colors": [
                    "Neutral",
                    "Green",
                    "Blue",
                    "Yellow"
                ]
            }
            ,
            {
                "Name": "Ness",
                "Colors": [
                    "Neutral",
                    "Green",
                    "Blue",
                    "Yellow"
                ]
            }
            ,
            {
                "Name": "Peach",
                "Colors": [
                    "Neutral",
                    "Yellow",
                    "White",
                    "Green",
                    "Blue"
                ]
            }
            ,
            {
                "Name": "Pichu",
                "Colors": [
                    "Neutral",
                    "Blue",
                    "Red",
                    "Green"
                ]
            }
            ,
            {
                "Name": "Pikachu",
                "Colors": [
                    "Neutral",
                    "Green",
                    "Blue",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Jigglypuff",
                "Colors": [
                    "Neutral",
                    "Red",
                    "Yellow",
                    "Green",
                    "Blue"
                ]
            }
            ,
            {
                "Name": "Roy",
                "Colors": [
                    "Neutral",
                    "Yellow",
                    "Red",
                    "Green",
                    "Blue"
                ]
            }
            ,
            {
                "Name": "Samus",
                "Colors": [
                    "Neutral",
                    "Green",
                    "Purple",
                    "Black",
                    "Pink"
                ]
            }
            ,
            {
                "Name": "Sheik",
                "Colors": [
                    "Neutral",
                    "Blue",
                    "Red",
                    "Green",
                    "White"
                ]
            }
            ,
            {
                "Name": "Yoshi",
                "Colors": [
                    "Neutral",
                    "Pink",
                    "Blue",
                    "LightBlue",
                    "Yellow",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Young Link",
                "Colors": [
                    "Neutral",
                    "Black",
                    "White",
                    "Blue",
                    "Red"
                ]
            }
            ,
            {
                "Name": "Zelda",
                "Colors": [
                    "Neutral",
                    "White",
                    "Green",
                    "Blue",
                    "Red"
                ]
            }
        ]
    }
}