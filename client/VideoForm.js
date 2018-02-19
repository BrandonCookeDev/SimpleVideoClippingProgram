import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class VideoForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            video: '',
            videoFiles: [],
            videoDirectory: './videos'
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

        
        return (
            <div>
                <video height="478.125" width="850" src={this.state.video}
                    id="previewVideo" lower-volume="0.3" track-time
                    controls autoplay style="object-fit:initial" >
                </video>
                <br/>
                <form>
                    <table>
                        <tr>
                            <td><label>Video: </label></td>
                            <td>
                                <select name="video">
                                    {this.state.videoFiles.map(x => <option>{x}</option>)}
                                </select>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        )
    }
}