export const showBrowserNotification = (title, options) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
};

export const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.play().catch(e => console.error('Error playing notification sound:', e));
};