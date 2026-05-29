/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNotifications } from "../../hooks/useNotifications";

function DepositIcon() {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "4px",
        backgroundColor: "#128330",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 14.1667V2.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 9.16699L10 14.167L15 9.16699"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.8332 17.5H4.1665"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function WithdrawalIcon() {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "4px",
        backgroundColor: "#CE0303",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7.5L10 2.5L5 7.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 2.5V14.1667"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.1665 17.5H15.8332"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function InfoIcon() {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "4px",
        backgroundColor: "#E7F3EA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip-info)">
          <path
            d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z"
            stroke="#128330"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 13.3333V10"
            stroke="#128330"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 6.66699H10.01"
            stroke="#128330"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip-info">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L5 15"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 5L15 15"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotificationItem({ notification }: { notification: any }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop: 0,
        paddingBottom: 0,
        height: "70px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {notification.icon_type === "deposit" && <DepositIcon />}
        {notification.icon_type === "withdrawal" && <WithdrawalIcon />}
        {notification.icon_type === "info" && <InfoIcon />}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          flex: 1,
          minWidth: 0,
        }}
      >
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.5",
            fontFamily: "Archivo",
            margin: 0,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          <span style={{ fontWeight: 500, color: "#1E1E1E" }}>
            {formatCurrency(notification.amount)}
          </span>
          <span style={{ fontWeight: 400, color: "#666666" }}>
            {" " + notification.action + " "}
          </span>
          <span style={{ fontWeight: 500, color: "#1E1E1E" }}>
            {notification.target}
          </span>
          <span style={{ fontWeight: 400, color: "#666666" }}>
            {" - " + notification.status}
          </span>
        </p>
        <p
          style={{
            fontSize: "13px",
            lineHeight: "1.5",
            fontWeight: 400,
            color: "#666666",
            fontFamily: "Archivo",
            marginTop: "6px",
          }}
        >
          {notification.time}
        </p>
      </div>
    </div>
  );
}

interface NotificationsDrawerProps {
  onClose: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  onClose,
}) => {
  const {
    notifications,
    loading,
    error,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "580px",
        borderRadius: "10px",
        border: "1px solid rgba(18,131,48,0.30)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        boxShadow: "4px 4px 10px 0 rgba(204,204,204,0.20)",
        maxHeight: "700px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "30px",
          paddingRight: "30px",
          height: "74px",
          borderBottom: "1px solid #DDDDDD",
          flexShrink: 0,
          backgroundColor: "white",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#1E1E1E",
            fontFamily: "Archivo",
            lineHeight: "1.5",
          }}
        >
          Notifications
        </span>
        <button
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: 1,
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
          aria-label="Close notifications"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Notification list */}
      <div
        style={{
          overflowY: "auto",
          flex: 1,
        }}
      >
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#999",
              fontFamily: "Archivo",
              fontSize: "14px",
            }}
          >
            Loading notifications...
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#CE0303",
              fontFamily: "Archivo",
              fontSize: "14px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#999",
              fontFamily: "Archivo",
              fontSize: "14px",
            }}
          >
            No notifications
          </div>
        )}

        {!loading &&
          !error &&
          notifications.map((notif, index) => (
            <div key={notif.id}>
              <NotificationItem notification={notif} />
              {index < notifications.length - 1 && (
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#DDDDDD",
                    margin: 0,
                  }}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationsDrawer;
