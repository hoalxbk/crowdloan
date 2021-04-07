'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive');
const HelperUtils = use('App/Common/HelperUtils');
const Const = use('App/Common/Const');

class FileController {
  async uploadAvatar({request}) {
    const validationOptions = {
      types: ['image'],
      size: Const.FILE_SITE,
      extnames: Const.FILE_EXT
    };

    const profilePic = request.file('avatar', validationOptions);
    const timeStamp = Date.now();
    const fileName = timeStamp + '_' + (profilePic.clientName || '').replace(/\s/g, '_');
    await profilePic.move(Helpers.tmpPath('uploads'), {
      name: fileName,
      overwrite: true
    });
    if (!profilePic.moved()) {
      return profilePic.error()
    }

    return HelperUtils.responseSuccess({ fileName });
  }

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
