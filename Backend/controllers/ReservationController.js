import Reservation from "../models/reservation.js";
import Restaurant from "../models/restaurant.js";
import Table from "../models/Table.js";

export const addReservation = async (req, res) => {
    try {
        const { idRes, idTable } = req.body;

        // Validate required fields
        if (!idRes || !idTable) {
            return res.status(400).json({ message: "Restaurant ID and Table ID are required" });
        }

        // Find the restaurant
        const restaurant = await Restaurant.findById(idRes);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Find the table
        const table = await Table.findById(idTable);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        // Check if the table is already occupied
        if (table.statut === "Occupée") {
            return res.status(400).json({ message: "Table is already occupied" });
        }

        // Create reservation
        const reservation = await Reservation.create({ ...req.body });

        // Update table status to "Occupée"
        table.statut = "Occupée";
        await table.save();

        res.status(201).json({ message: "Reservation created successfully", reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
