import React from 'react';
import './Tags.css';
import { API_ENDPOINT } from  '../../secrets/APIEndpoint';
import axios from 'axios';
import {Row, Col} from 'react-bootstrap';

const config = {
  headers: {
      "Access-Control-Allow-Origin": "*"    }
}
  axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';


class Tags extends React.Component{
  state = {
    tags:[],
    tagName:''
  }

  componentDidMount(){
    const GET_TAGS = `${API_ENDPOINT}/api/tag`

    axios.get(GET_TAGS, config)
    .then(response => {
      if(response.status)
      {
        this.setState({tags:response.data.data})
      }
      else
      {
        return({error:"Error in retrieving tags"})
      }
    }).catch(e => {
        console.log(e)
    })
  }

  addTag = () => {
    const POST_TAGS = `${API_ENDPOINT}/api/tag`
    const data = {
      "name":this.state.tagName
    }
    axios.post(POST_TAGS,data, config)
    .then(response => {
      if(response.status)
      {
        let temp = this.state.tags;
        temp.push(response.data.data)
        console.log("Added tag:", response.data)
        this.setState({tags:temp, tagName:''})
      }
      else
      {
        return({error:"Error in retrieving tags"})
      }
    }).catch(e => {
        console.log(e)
    })
  }

  render(){
    return(
      <Col id="tag">
        <Row>
          <input
            placeholder="Tag name"
            className="input-tag"
            value={this.state.tagName}
            onChange={(e)=>{this.setState({tagName:e.target.value})}}
            type="text"
          />
          <button onClick={this.addTag}>Add tag</button>
        </Row>
        
        <Row style={{width:'100%', marginTop:10}}>
          <div style={{display:'flex', width:'100%'}}>
          {
            this.state.tags.map((tag, index)=>(
              <div className="tag">{tag.name}</div>
            ))
          }
          </div>
        </Row>
      </Col>
    )
  }
}

export default Tags;