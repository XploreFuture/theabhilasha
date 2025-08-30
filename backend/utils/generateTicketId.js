// utils/generateTicketId.js
import Ticket from "../models/Ticket.js";

export const generateTicketId = async () => {
  const count = await Ticket.countDocuments(); 
  return `Abhilasha-${String(count + 1).padStart(4, "0")}`;
};
