import Restaurant from "../models/restaurant.js";
import Table from "../models/Table.js";

export const addRes = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(Restaurant);
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export const getRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate("Tables"); // Populate tables data
        res.json(restaurants);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const RestaurantId = req.params.id;
        const restaurant = await Restaurant.findById(RestaurantId).populate("Tables");
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const RestaurantId = req.params.id;
        const { Nom,Adresse, Statut } = req.body;
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            RestaurantId,
            req.body,
            { new: true }
        );
        if (!updatedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(updatedRestaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const deleteRestaurant = async (req, res) => {
    try {
        const RestaurantId = req.params.id;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(RestaurantId);
        if (!deletedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const AddTableToRestaurant = async (req, res) => {

    try {
        const { tableId, restaurantId } = req.body;

        
        const table = await Table.findById(tableId);
        console.log(table);
        const restaurant = await Restaurant.findById(restaurantId);
        console.log(restaurant);

        if (!table || !restaurant) {
            return res.status(404).json({ message: 'Table or restaurant not found' });
        }

        const TableAlreadyExists = restaurant.Tables.includes(tableId);
        
        if (TableAlreadyExists ) {
            return res.status(400).json({ message: 'Table already exists in the restaurant' });
          
        } else {
            
            restaurant.Tables.push(tableId);
            
            await restaurant.save();
            
        }

        res.status(200).json({ message: 'Table added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }

}
