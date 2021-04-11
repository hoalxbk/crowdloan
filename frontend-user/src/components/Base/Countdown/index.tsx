import React, { useState, useEffect } from 'react';
import useStyles from './style';

type CountDownProps = {
  startDate?: Date
}

const Countdown: React.FC<CountDownProps> = ({ startDate = new Date() }: CountDownProps) => {
  const styles = useStyles();
  const [second, setSecond] = useState('0');
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('0');
  const [day, setDay] = useState('0');

  useEffect(() => {
    (function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

        let countDown = startDate.getTime();
        let countDownInterval = setInterval(function() {    

          let now = new Date().getTime(), distance = countDown - now;

          const currentDay = Math.floor(distance / (day));
          const currentHour = Math.floor((distance % (day)) / (hour))
          const currentMinute = Math.floor((distance % (hour)) / (minute));
          const currentSecond = Math.floor((distance % (minute)) / second)

          setDay(currentDay < 10 ? `0${currentDay}`: `${currentDay}`);
          setHour(currentHour < 10 ? `0${currentHour}`: `${currentHour}`);
          setMinute(currentMinute < 10 ? `0${currentMinute}`: `${currentMinute}`);
          setSecond(currentSecond < 10 ? `0${currentSecond}`: `${currentSecond}`);

          //do something later when date is reached
          if (distance <= 0) {
            clearInterval(countDownInterval);
          }
          //seconds
        }, 0)
    }());
  }, []);

  return (
    <div id="countdown">
      <ul style={{ display: 'flex', alignItems: 'flex-start' }}>
        <li className={styles.countdownPart}>
          <span id="days">{day}</span><span className={styles.countdownInfo}>Days</span>
        </li>
        <li className={styles.countdownPart}>:</li>
        <li className={styles.countdownPart}>
          <span id="hours">{hour}</span><span className={styles.countdownInfo}>Hours</span>
        </li>
        <li className={styles.countdownPart}>:</li>
        <li className={styles.countdownPart}>
          <span id="minutes">{minute}</span><span className={styles.countdownInfo}>Minutes</span></li>
        <li className={styles.countdownPart}>:</li>
        <li className={styles.countdownPart}>
          <span id="seconds">{second}</span><span className={styles.countdownInfo}>Seconds</span></li>
      </ul>
    </div>
  )
}

export default Countdown;
