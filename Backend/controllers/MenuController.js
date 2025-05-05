import Menu from '../models/Menu.js';



export const addMenu = async (req, res) => {
    try {
        const menu = await Menu.create(req.body);
        res.status(201).json(Menu);
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export const getMenu = async (req, res) => {
    try {
        const menu = await Menu.find();
        res.json(menu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const getMenuById = async (req, res) => {
    try {
        const MenuId = req.params.id;
        const menu = await Menu.findById(MenuId);
        if (!restaurant) {
            return res.status(404).json({ error: 'menu not found' });
        }
        res.json(menu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateMenu = async (req, res) => {
    try {
        const MenuId = req.params.id;
        const { Nom,Description } = req.body;
        const updatedMenu = await Menu.findByIdAndUpdate(
            MenuId,
            req.body,
            { new: true }
        );
        if (!updatedMenu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.json(updatedMenu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const deleteMenu = async (req, res) => {
    try {
        const MenuId = req.params.id;
        const deletedMenu = await Menu.findByIdAndDelete(MenuId);
        if (!deletedMenu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.json({ message: 'Menu deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};