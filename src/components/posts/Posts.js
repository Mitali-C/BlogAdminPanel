import React from 'react';
import './Posts.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Col,Row, Modal, Image} from 'react-bootstrap';
import { API_ENDPOINT } from  '../../secrets/APIEndpoint';
import axios from 'axios';

const config = {
  headers: {
      "Access-Control-Allow-Origin": "*"    }
}
  axios.defaults.headers.post['Content-Type'] ='multipart/form-data';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class Posts extends React.Component{
  state = {
    post:'',
    images:[],
    headerImage:'',
    title:'',
    tags:[],
    selectedTag:{},
    preview:false
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

  handlePreview = () =>{
    this.setState({preview:!this.state.preview})
  }

  handleTextChange = (e) => {
    this.setState({post:e}, ()=>console.log(this.state.post))
  }

  imageHandler() {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      console.log("Image change:", file)
      const formData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', 'blog-mc')

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/blog-mc/image/upload",
        {
          method:'POST',
          body:formData
        }
      )

      const received_file = await res.json();
      console.log("FILE RESPONSE:", received_file)

      // this.setState({images:[...this.state.images, received_file.secure_url]})
      // Save current cursor state
      const range = this.quill.getSelection(true);

      // Insert temporary loading placeholder image
      // this.quill.insertEmbed(range.index, 'image', `${window.location.origin}/images/loaders/placeholder.gif`);

      // Move cursor to right side of image (easier to continue typing)
      this.quill.setSelection(range.index + 1);

      // const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'

      // Remove placeholder image
      this.quill.deleteText(range.index, 1);

      // Insert uploaded image
      // this.quill.insertEmbed(range.index, 'image', res.body.image);
      this.quill.insertEmbed(range.index, 'image', received_file.secure_url);
    };
  }

  addHeaderImage = async (e) => {
      const file = e.target.files[0];
        console.log("Image change:", file)
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', 'blog-mc')

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/blog-mc/image/upload",
          {
            method:'POST',
            body:formData
          }
        )

        const received_file = await res.json();
        console.log("FILE RESPONSE:", received_file)
        this.setState({headerImage:received_file.secure_url})
  }

  handlePost = () => {
    const data={
      content:this.state.post,
      title:this.state.title,
      headerImage:this.state.headerImage,
      images:this.state.images,
      tag:this.state.selectedTag.name
    }
    const ADD_TAGS = `${API_ENDPOINT}/api/post`
    axios.post(ADD_TAGS,data, config)
    .then(response => {
      if(response.status)
      {
        console.log("POST ADDED:", response.data)
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
      <Col id="posts">
        <Row>
          <input
            placeholder="Title"
            onChange={(e)=>{this.setState({title:e.target.value})}}
            className="title"
            value={this.state.title}
          />
        </Row>
        <Row style={{flexDirection:'column', marginBottom:20}}>
          <h6 style={{textAlign:'left'}}>Select a tag:</h6>
          <div style={{display:'flex', flexWrap:'wrap'}}>
            {
              this.state.tags.map((tag,index)=>(
                <div 
                  onClick={()=>{this.setState({selectedTag:tag})}}
                  className={this.state.selectedTag.name===tag.name ? 'selected-tag' : 'unselected-tag'}>
                  {tag.name}
                </div>
              ))
            }
          </div>
        </Row>
        <Row>
          <input
            type="file"
            onChange={this.addHeaderImage}
            placeholder="Upload header image"
            className="image-input"
          />
          {
            this.state.headerImage.length!==0 && <Image src={this.state.headerImage} alt="Header" fluid/>
          }
        </Row>
        <Row>
          <ReactQuill
            value={this.state.post}
            style={{
              width: "100%",
              fontSize: "1rem",
              border: "none",
              outline: "none",
            }}
            onChange={this.handleTextChange}
            modules={{
              toolbar: {
                  container: [
                      [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }],
                      [{ size: [] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ 'align': [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      // ['link', 'video'],
                      ['link', 'image', 'video'],
                      ['clean'],
                      ['code-block']
                  ],
                  handlers: {
                      image: this.imageHandler
                  }
              }
          }}
          />
        </Row>
        <Row style={{marginTop:70, justifyContent:'center', width:'100%'}}>
          <button className="btn" onClick={this.handlePreview}>Preview</button>
          <button className="btn" onClick={this.handlePost}>Post</button>
        </Row>
        <Modal
          size="lg"
          show={this.state.preview}
          onHide={this.handlePreview}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              {this.state.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div dangerouslySetInnerHTML={{__html:this.state.post}}/>
          </Modal.Body>
        </Modal>
      </Col>
    )
  }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Posts.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Posts.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

export default Posts;