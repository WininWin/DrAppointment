import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';

class FileView extends Component {
   constructor(props) {
        super(props);
        this.state = {
            renderPdf: []
        };

    this.onDocumentLoad = this.onDocumentLoad.bind(this)


    }
 
  onDocumentLoad = ({ numPages }) => {
    let temp = [];
    for(let i= 1; i <= numPages;i++){
       temp.push(  <Page key={i} pageNumber={i} />)
    }
  
    this.setState({ numPages ,
        renderPdf : temp.slice()
    });
  }

  render() {
 
    return (
      <div>
        <Document
           file={{
            data: this.props.data
          }}
          onLoadSuccess={this.onDocumentLoad}
        >

        {this.state.renderPdf}
        </Document>
      
      </div>
    );
  }
}

export default FileView;