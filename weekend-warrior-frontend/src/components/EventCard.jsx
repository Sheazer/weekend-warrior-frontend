import React from 'react';

function EventCard({ activity }) {
  return (
    <div style={{
      borderRadius: 15,
      overflow: "hidden",
      marginBottom: 15,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      background: "white"
    }}>
      <img 
        src={activity.image}
        style={{ width: "100%", height: 150, objectFit: "cover" }}
      />

      <div style={{ padding: 10 }}>
        <h3>{activity.title}</h3>
        <p style={{ color: "gray" }}>{activity.date}</p>
        <p style={{ color: "#667eea" }}>{activity.price}</p>
        <p>{activity.description}</p>
        <p>{activity.category}</p>
        <p>{activity.status}</p>
        <p>{activity.maxPeople}</p>
        <p>{activity.organizerID}</p>
        <p>{activity.needModeration ? "Да" : "Нет"}</p>
      </div>
    </div>
  );
}

export default EventCard;