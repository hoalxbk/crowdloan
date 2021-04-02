'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive');

class FileController {
  async getImage({ response, params }) {
    const filePath = `uploads/${params.fileName}`;
    const isExist = await Drive.exists(filePath);
    if (isExist) {
      return response.download(Helpers.tmpPath(filePath));
    }
    return 'File does not exist';
  }
}

module.exports = FileController
