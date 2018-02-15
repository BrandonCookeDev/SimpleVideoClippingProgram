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
        alert('A name was submitted: ' + this.state.video);
        event.preventDefault();
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <table>
                    <tr>
                        <td><label>Video Title</label></td>
                        <td>
                            <input type='text' name='video.title' 
                                onChange={this.handleInputChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>description</label></td>
                        <td>
                            <textarea rows="4" columns="25" name="video.description"
                                    value={this.state.video.description} 
                                    onChange={this.handleInputChange} />
                        </td>
                    </tr>
                    <tr>
                        <td><label>tags</label></td>
                        <td>
                            <input type="text" name="video.tags" 
                                placeholder="separated by comma" 
                                onChange={this.handleInputChange}/>
                        </td>
                    </tr> 
                </table>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}