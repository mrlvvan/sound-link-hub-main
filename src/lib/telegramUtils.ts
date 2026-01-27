/**
 * Opens a Telegram chat with the specified username
 * Works both inside Telegram WebApp and in regular browsers
 */
export const openTelegramChat = (username: string) => {
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  const telegramUrl = `https://t.me/${cleanUsername}`;
  
  // Check if running inside Telegram WebApp
  if ((window as any).Telegram?.WebApp) {
    (window as any).Telegram.WebApp.openTelegramLink(telegramUrl);
  } else {
    // Fallback for regular browsers
    window.open(telegramUrl, '_blank');
  }
};
