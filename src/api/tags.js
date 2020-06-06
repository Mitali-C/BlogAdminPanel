import { API_ENDPOINT } from  '../secrets/APIEndpoint';
import axios from 'axios';

const config = {
  headers: {
      "Access-Control-Allow-Origin": "*"    }
}
  axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  // api to get all tags
export const getTags = () => {
  const GET_TAGS = `${API_ENDPOINT}/api/tag`

  axios.get(GET_TAGS, config)
  .then(response => {
    if(response.status)
    {
      return(response.data)
    }
    else
    {
      return({error:"Error in retrieving tags"})
    }
  }).catch(e => {
      console.log(e)
  })
}