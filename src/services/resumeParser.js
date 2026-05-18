const { PDFParse } = require('pdf-parse'); //node library to extract text from pdf 
const mammoth = require('mammoth'); //library to extract from .docx files 
const fs = require('fs'); //for file handlingg
//all these imports are for convverting extracted text to readable text or can say siimple text

const parseResume = async(filepath,mimeType)=>{
    if(mimeType=='application/pdf'){
        const dataBuffer=fs.readFileSync(filepath);
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
    }else if(mimeType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        const result = await mammoth.extractRawText({path:filepath});
        return result.value;
}else{
    throw new Error('unsupported file type pls upload pdf or docx');
}
};
module.exports = {parseResume};