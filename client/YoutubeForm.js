import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class YoutubeForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            video: {
                title: '',
                description: '',
                tags: '',
                error: ''
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
        alert('A name was submitted: ' + this.state.video);
        event.preventDefault();
        document.getElementById('newYoutubeForm').reset();
    }

    render(){
        return(
            <div>
                <h4>Youtube Details</h4>
                <form onSubmit={this.handleSubmit} id='newYoutubeForm'>
                    <label class='errorLabel'>{this.state.error}</label>
                    <table>
                        <tr>
                            <td><label>Video Title</label></td>
                            <td>
                                <input type='text' name='video.title' class='form-control'
                                    onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>description</label></td>
                            <td>
                                <textarea rows="4" columns="25" name="video.description"
                                        value={this.state.video.description} class='form-control'
                                        onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>tags</label></td>
                            <td>
                                <input type="text" name="video.tags" 
                                    class='form-control'
                                    placeholder="separated by comma" 
                                    onChange={this.handleInputChange}/>
                            </td>
                        </tr> 
                    </table>
                    <input type="submit" value="Submit" class='btn-success'/>
                </form>
            </div>
        )
    }
}