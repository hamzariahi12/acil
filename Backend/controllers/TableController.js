import Table from '../models/Table.js';

export const addTab = async (req, res) => {
    try {
        const table = await Table.create(req.body);
        res.status(201).json(Table);
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export const getTable = async (req, res) => {
    try {
        const table = await Table.find();
        res.json(Table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
export const getTableById = async (req, res) => {
    try {
        const TableId = req.params.id;
        const table = await Table.findById(TableId);
        if (!Table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json(Table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const updateTable = async (req, res) => {
    try {
        const TableId = req.params.id;
        const { NumTable,statut, NBPlace } = req.body;
        const updatedTable = await Table.findByIdAndUpdate(
            TableId,
            req.body,
            { new: true }
        );
        if (!updatedTable) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json(updatedTable);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const deleteTable = async (req, res) => {
    try {
        const TableId = req.params.id;
        const deletedTable = await Table.findByIdAndDelete(TableId);
        if (!deletedTable) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json({ message: 'Table deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
