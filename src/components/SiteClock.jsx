import { useEffect, useState } from 'react';

const NY_TZ = 'America/New_York';

function formatNyClock(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).formatToParts(now);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');
  const zone = get('timeZoneName');

  return `${hour}:${minute}:${second} ${zone}`;
}

/** Live New York clock for the fixed site chrome. */
const SiteClock = () => {
  const [time, setTime] = useState(() => formatNyClock(new Date()));

  useEffect(() => {
    const tick = () => setTime(formatNyClock(new Date()));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="site-chrome-clock" aria-live="polite" aria-atomic="true">
      <span className="site-chrome-clock-place">NEW YORK, NY</span>
      <span className="site-chrome-clock-sep" aria-hidden>
        {' '}
      </span>
      <span className="site-chrome-clock-time">{time}</span>
    </div>
  );
};

export default SiteClock;
