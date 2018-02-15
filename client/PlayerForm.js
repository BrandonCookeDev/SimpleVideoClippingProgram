import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {find} from 'lodash'

export default class PlayerForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            players: [],
            form: {
                tag: '',
                character: '',
                color: ''
            },
            error: ''
        }

        this.createPlayer = this.createPlayer.bind(this);
        this.handleFormInputChange = this.handleFormInputChange.bind(this, 'form');
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createPlayer(){
        try{
            var character = new Character(this.character, this.color);
            character.validateCharacter()
            var player = new Player(this.tag, character);

            this.setState(prevState => ({
                players: prevState.players.push(player)
            }));

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
        alert('A player was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render(){

        var characterData = CharacterList.getData();
        var characterSelected = characterData.filter((o) => o.Name === this.state.form.character);
        var colorOptions = characterSelected.length > 0 ? 
            characterSelected.Colors.map(x => <option>{x}</option>) : [];   

        //{CharacterList.getData()[this.state.form.character][Colors].map(x => <option>{x}</option>)}
                           
        return(
            <form onSubmit={this.handleSubmit}>
                <label id="playerError" value={this.state.error} />
                <table>
                    <tr>
                        <td><label>Tag: </label></td>
                        <td> 
                            <input type='text' onChange={this.handleFormInputChange}
                                placeholder='xxxGrinder69mlgnoscopes' name='form.tag'/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Character: </label></td>
                        <td>
                            <select onChange={this.handleFormInputChange} name='form.character'>
                                {characterData.map(x => <option>{x.Name}</option>)}
                            </select>
                        </td>
                    </tr>   
                    <tr>
                        <td><label>Color: </label></td>
                        <td>
                            <select onChange={this.handleFormInputChange} name='form.color'>  
                                {colorOptions}  
                            </select>
                        </td>
                    </tr>
                </table>
                <input type='submit' value='addPlayer' />
            </form>
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
        let data = CharacterList.getData;
        let characterExists = _.find(data, {"Name": this.name});
        if(!characterExists)
            throw new Error('No character named ' + this.name);

        let characterColorExists = data[character][Colors].includes(this.color);
        if(!characterColorExists)
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