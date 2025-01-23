import axios from 'axios';
import { useEffect, useState } from 'react';

type TBookings = {
  id: string
  roomNumber: number
  dailyRate: number
  status: string
}

const API_URL = 'http://localhost:5000/bookings';

function App() {
  const [bookings, setBookins] = useState<TBookings[]>([]);
  const [bookedRooms, setBookedRooms] = useState(0); 
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    findAllBookings();
  }, []);

  const findAllBookings = async () => {
    const response = await axios.get(API_URL);
    setBookins(response.data);
  };

  const formatPrice = (price: number) => {
    return `R$ ${price}.00`
  }

  const handleDecreaseBookings = () => {
    if (bookedRooms > 0) {
      setBookedRooms(bookedRooms - 1);
    }
  }

  const handleIncreaseBookings = () => {
    setBookedRooms(bookedRooms + 1);
  }

  const handleSendBookings = async () => {
    const response = await axios.post(API_URL, {
      roomAmount: bookedRooms
    });

    if (response.data.statusCode === 404) {
      setBookingError(response.data.message);
    } else {
      const response = await axios.get(API_URL);
      setBookins(response.data);
    }
  }

  const handleHideError = () => {
    setBookingError(null);
  }

  return (
    <>
      <div className='wrapper'>
        <div className='booking-section'>
          {bookingError && (
            <div className='booking-error-message'>
              {bookingError}
              <div onClick={handleHideError} className='btn-close'>x</div>
            </div>
          )}
          <div className='booking-section-row'>
            <span>Escolha a quantidade de quartos a serem reservados:</span>
            <div className='box-btns'>
              <button className='btn-less' onClick={handleDecreaseBookings}>-</button>
              <button className='btn-more' onClick={handleIncreaseBookings}>+</button>
            </div>
            <div className='box-amount'>{bookedRooms}</div>
            <button disabled={bookedRooms === 0 ? true : false} className='btn-send' onClick={handleSendBookings}>Enviar</button>
          </div>
        </div>
        <table>
          <tbody>
            {bookings.map((booking: TBookings) => (
              <tr key={booking.id} className={booking.status === 'available' ? 'room-available' : 'room-reserved'}>
                <td><span>quarto:</span> {booking.roomNumber}</td>
                <td><span>diária:</span> {formatPrice(booking.dailyRate)}</td>
                <td className={booking.status === 'available' ? 'status-available' : ''}><span>status:</span> {booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App;
