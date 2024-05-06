import React, { useState } from "react";
import { PiChairFill } from "react-icons/pi";
const Seat = ({ seatId, selectedSeats, onSeatClick, isreserved }) => {
  const isSelected = selectedSeats.includes(seatId);

  const handleSeatClick = () => {
    onSeatClick(seatId);
  };

  return isreserved ? (
    <div className="seating-disabled">
      {/* {seatId} */}
      <div className="seat-icon">
        <PiChairFill />
      </div>
    </div>
  ) : (
    <div
      className={`seat ${isSelected ? "selected" : ""}`}
      onClick={handleSeatClick}
    >
      {/* {seatId} */}
      <div className="seat-icon">
        <PiChairFill />
      </div>
    </div>
  );
};

export default Seat;
