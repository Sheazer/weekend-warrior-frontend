function EventCard() {
  return (
    <div style={{
      borderRadius: 15,
      overflow: "hidden",
      marginBottom: 15,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      background: "white"
    }}>
      <img 
        src="https://via.placeholder.com/400x200"
        style={{ width: "100%", height: 150, objectFit: "cover" }}
      />

      <div style={{ padding: 10 }}>
        <h3>Футбол во дворе ⚽</h3>
        <p style={{ color: "gray" }}>12 апреля, 18:00</p>
        <p style={{ color: "#667eea" }}>2 км от тебя</p>
      </div>
    </div>
  );
}

export default EventCard;