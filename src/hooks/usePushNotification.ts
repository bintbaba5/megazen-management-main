export default function usePushNotification() {
  const sendNotification = async ({
    token,
    title,
    message,
    link,
  }: {
    token: string;
    title: string;
    message: string;
    link: string;
  }) => {
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title,
          message,
          link,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      const data = await response.json();
      console.log("Notification sent successfully:", data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return { sendNotification };
}
