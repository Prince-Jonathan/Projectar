window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
  OneSignal.init({
    appId: "88669c69-3692-49b8-9458-93694b80eeef",
    notifyButton: {
      enable: true,

      size: "medium",
      theme: "inverse",
      colors: {
        // Customize the colors of the main button and dialog popup button
        "circle.background": "rgb(84,110,123)",
        "circle.foreground": "#ffee00",
        "badge.background": "rgb(84,110,123)",
        "badge.foreground": "white",
        "badge.bordercolor": "white",
        "pulse.color": "#ffee00",
        "dialog.button.background.hovering": "rgb(77, 101, 113)",
        "dialog.button.background.active": "rgb(70, 92, 103)",
        "dialog.button.background": "rgb(84,110,123)",
        "dialog.button.foreground": "white",
      },
      position: "bottom-right",
      text: {
        "tip.state.unsubscribed": "Subscribe to Projectar notifications",
        "tip.state.subscribed": "You're subscribed to notifications",
        "tip.state.blocked": "You've blocked notifications",
        "message.prenotify": "Click to subscribe to Projectar notifications",
        "message.action.subscribed": "Thanks for subscribing!",
        "message.action.resubscribed": "You're subscribed to notifications",
        "message.action.unsubscribed": "You won't receive notifications again",
        "dialog.main.title": "Manage Site Notifications",
        "dialog.main.button.subscribe": "SUBSCRIBE",
        "dialog.main.button.unsubscribe": "UNSUBSCRIBE",
        "dialog.blocked.title": "Unblock Notifications",
        "dialog.blocked.message":
          "Follow these instructions to allow notifications:",
      },
      prenotify: true,
      showCredit: false,
    },
  });
});