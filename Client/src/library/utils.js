export const formatMessageTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);

  return messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};