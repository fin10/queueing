import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Timer } from '../utils/Timer';

export const ExpireTime = (props: { format?: string; expireTime: Date }): React.ReactElement => {
  const { format = 'hh:mm:ss', expireTime } = props;
  const [currentTime, updateCurrentTime] = useState(moment.utc());

  useEffect(() => {
    const listener = {
      onTime: () => {
        let now = moment.utc();
        if (now.isAfter(expireTime)) {
          now = moment.utc(expireTime);
          Timer.removeListener(listener);
        }
        updateCurrentTime(now);
      },
    };

    Timer.addListener(listener);

    return () => Timer.removeListener(listener);
  }, []);

  return <Moment date={expireTime} duration={currentTime} format={format} />;
};
