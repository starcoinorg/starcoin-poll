export const LANGUAGES_LABEL = [
  {
    code: 'en',
    text: 'English',
  },
  {
    code: 'zh',
    text: '中文',
  },
];

export const POLLING_INTERVAL = 19000;

export enum POLL_STATUS {
  PENDING = 1,    //等待公示时期
  ACTIVE = 2,     //正在进行投票
  DEFEATED = 3,   //投票期过后，同意的票数小于等于反对的票数，或者同意的票数小于投票阈值，提案被拒绝
  AGREED = 4,     //投票期过后，同意的票数大于反对的票数，提案通过
  QUEUED = 5,     //投票通过的提案被放入等待执行队列进行公示，当前公示期为 24 小时
  EXECUTABLE = 6, //经过公示期后，进入可执行状态。任何人可以触发执行。
  EXECUTED = 7,  //提案已经执行
}
