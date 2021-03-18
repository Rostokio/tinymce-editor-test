import React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import "./App.css";

export const downloadFile = (data) => {
    let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    let link = document.createElement('a');
    link.download = `file.docx`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
};

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: {}}
    }

    handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
        this.setState({data: content});
    }

    render() {
        return (
            <div className="App">
                <Editor
                    initialValue="<p>This is the initial content of the editor</p>"
                    init={{
                        templates: [
                            {
                                title: "Replace Values template example",
                                description:
                                    "This template has placeholder variables that will be replaced when this template is inserted in to TinyMCE.",
                                content:
                                    "<p>Congratulations {$owner_name}!</p>" +
                                    "<p>Our voting panel have agreed that {$cat_name} is definitely the {$category} cat out there.</p>" +
                                    "<p>We loved seeing your photo, and will be sharing on our social media channels.</p>" +
                                    "<p>Keep {$cat_name} being the {$category} cat - we know you will!</p>" +
                                    '<p>Regards,<br>The 2020 Voting Panel<br><span class="created-date" style="font-size:8pt;">[created date]</span></p>'
                            }
                        ],

                        template_replace_values: {
                            owner_name: "Marty",
                            cat_name: "Toby",
                            category: "Most Handsome"
                        },

                        template_cdate_classes: "created-date",
                        template_cdate_format: "%A %d %B %Y",
                        language: 'ru',
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount template'
                        ],
                        toolbar:
                            'undo redo | formatselect | fontselect fontsizeselect | bold italic backcolor forecolor | \
                            alignleft aligncenter alignright alignjustify | table \
                            bullist numlist outdent indent | removeformat | help | template'
                    }}
                    onEditorChange={this.handleEditorChange}
                />
                <br/>
                <button onClick={() => {
                    let url = new URL("http://localhost:8080/convert");
                    console.log(this.state.data)
                    fetch(url, {
                        method: 'POST',
                        body: '<body>' + this.state.data + '</body>'
                    })
                        .then(response => {
                            if (response.ok) {
                                response.blob().then(r => downloadFile(r))
                            }
                        })
                        .catch(e => console.log(e));
                }}>Сохранить
                </button>
            < /div>
        );
    }
}

export default App;