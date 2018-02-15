import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class VideoForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            video: {
                title: '',
                description: '',
                tags: ''
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>Video Title</label>
                <input type='text' name='video.title' 
                        onChange={this.handleInputChange}/>
                <br/>
                <label>description</label>
                <textarea rows="4" columns="25" name="video.description"
                        value={this.state.video.description} 
                        onChange={this.handleInputChange}>
                </textarea>
                <br/>
                <label>tags</label>
                <input type="text" name="video.tags" 
                    placeholder="separated by comma" 
                    onChange={this.handleInputChange}/>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}