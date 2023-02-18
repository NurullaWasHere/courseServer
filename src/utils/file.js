const DataUriParser = require('datauri/parser')

const parser = new DataUriParser();

const bufferToDataURI = (fileFormat, buffer) => {
    parser.format(fileFormat,buffer)
}

module.exports = {
    bufferToDataURI
}