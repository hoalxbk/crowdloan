'use strict'

const kue = use('Kue');
const Const = use('App/Common/Const');
const Env = use('Env')

const priority = 'critical'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 5; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => { // Function to be run on the job before it is saved
  job.backoff()
};

class PickRandomWinnerJob {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 5
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return Const.JOB_KEY.SEND_ADMIN_INFO_EMAIL;
  }

  // This is where the work is done.
  async handle (data) {
    console.log('PickRandomWinnerJob-job started', data);
    try {

    } catch (e) {
      console.log(e);
    }
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch pickup random winner with data : ', data);
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = PickRandomWinnerJob

