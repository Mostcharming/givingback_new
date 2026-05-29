/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";

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

interface CalendarDrawerProps {
  onClose: () => void;
}

const CalendarDrawer: React.FC<CalendarDrawerProps> = ({ onClose }) => {
  const { dayGroups, loading, error, deleteEvent, isNGO } = useCalendarEvents();

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "4px 4px 10px 0 rgba(204,204,204,0.20)",
        border: "1px solid rgba(18,131,48,0.30)",
        width: "100%",
        maxWidth: "580px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "700px",
        fontFamily: "Archivo",
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
          paddingTop: "30px",
          paddingBottom: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          CALENDAR
        </span>
        <button
          onClick={onClose}
          style={{
            padding: "4px",
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
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Date + Chevron */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "30px",
          paddingRight: "30px",
          marginTop: "12px",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
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
        >
          <span
            style={{
              color: "#1E1E1E",
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Mon, 22 Apr
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="#666666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "30px",
          paddingRight: "30px",
          marginTop: "12px",
          marginBottom: "16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Today button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderRadius: "10px",
              border: "1px solid rgba(18,131,48,0.50)",
              color: "#128330",
              fontFamily: "Archivo",
              fontSize: "14px",
              background: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(18,131,48,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            Today
          </button>
          {/* Prev arrow */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
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
            aria-label="Previous"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Next arrow */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
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
            aria-label="Next"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Add button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
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
          aria-label="Add event"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.1665 10H15.8332"
              stroke="#666666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 4.16699V15.8337"
              stroke="#666666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid rgba(18,131,48,0.15)",
          marginLeft: "30px",
          marginRight: "30px",
          flexShrink: 0,
        }}
      />

      {/* Scrollable event list */}
      <div
        style={{
          overflowY: "auto",
          flex: 1,
          paddingLeft: "30px",
          paddingRight: "30px",
          paddingBottom: "30px",
        }}
      >
        {!isNGO && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#999",
              fontFamily: "Archivo",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Calendar is only available for NGO users
          </div>
        )}

        {isNGO && loading && (
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
            Loading events...
          </div>
        )}

        {isNGO && error && (
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

        {isNGO && !loading && !error && dayGroups.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "128px",
              color: "#999",
              fontFamily: "Archivo",
              fontSize: "14px",
            }}
          >
            No events scheduled
          </div>
        )}

        {isNGO &&
          !loading &&
          !error &&
          dayGroups.map((group) => (
            <div key={group.label} style={{ marginTop: "20px" }}>
              <p
                style={{
                  color: "#666",
                  fontFamily: "Archivo",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  marginBottom: "12px",
                }}
              >
                {group.label}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "11px",
                }}
              >
                {group.events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      position: "relative",
                      borderRadius: "10px",
                      border: "1px solid rgba(18,131,48,0.40)",
                      backgroundColor: "#F0F5F6",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => {
                      const closeBtn = e.currentTarget.querySelector("button");
                      if (closeBtn) {
                        closeBtn.style.opacity = "1";
                      }
                    }}
                    onMouseLeave={(e) => {
                      const closeBtn = e.currentTarget.querySelector("button");
                      if (closeBtn) {
                        closeBtn.style.opacity = "0";
                      }
                    }}
                  >
                    <p
                      style={{
                        color: "#1E1E1E",
                        fontFamily: "Archivo",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {event.title}
                    </p>
                    <p
                      style={{
                        color: "#444",
                        fontFamily: "Archivo",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "1.5",
                      }}
                    >
                      {new Date(event.start_time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.end_time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        opacity: 0,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "opacity 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity =
                          "0.6";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity =
                          "0";
                      }}
                      aria-label="Remove event"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 5L5 15"
                          stroke="#999"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 5L15 15"
                          stroke="#999"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CalendarDrawer;
