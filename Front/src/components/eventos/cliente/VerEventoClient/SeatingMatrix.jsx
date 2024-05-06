import React, { useState } from "react";
import Seat from "./Seat";

const SeatingMatrix = ({
  setDataTable,
  quitDataTable,
  numRows,
  numColumns,
  seatOcupados,
  selectedSeats,
  setSelectedSeats,
}) => {
  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      // setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
      let newtempseat = {
        row: seatId.split("-")[0],
        seat: seatId.split("-")[1],
      };
      quitDataTable(newtempseat.row, newtempseat.seat);
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      setDataTable(seatId);
    }
  };
  return (
    <div>
      <h5>Selecciona tus asientos</h5>
      <div className="seating-container">
        {Array.from({ length: numRows }).map((_, rowIndex) => (
          <div className="seat-row" key={rowIndex}>
            {Array.from({ length: numColumns }).map((_, colIndex) => {
              const seatId = `${rowIndex + 1}-${colIndex + 1}`;
              let isReserved = false;
              if (seatOcupados) {
                isReserved = seatOcupados.some(
                  (seat) =>
                    seat.fila === rowIndex + 1 && seat.columna === colIndex + 1
                );
              }

              return (
                <Seat
                  key={seatId}
                  seatId={seatId}
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                  isreserved={isReserved}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatingMatrix;
