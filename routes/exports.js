const express = require('express');
const ExportData = require('../models/exports');
const exportRouter = express.Router();

exportRouter.post("/api/exports", async (req, res) => {

    console.log(req.body);
    try {
        let exportData = new ExportData(req.body);
        console.log(exportData);
        exportData = await exportData.save();
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || null; // Get the limit from query params
        let exportData;

        if (limit) {
            exportData = await ExportData.find({}).limit(limit);
        } else {
            exportData = await ExportData.find({});
        }

        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



exportRouter.get("/api/exports/search", async (req, res) => {
    try {
        const searchQuery = req.query.q;
        if (!searchQuery) {
            return res.status(400).json({ error: "Query parameter 'q' is required" });
        }

        const regexQuery = { $regex: searchQuery, $options: "i" };

        // Determine if the search query can be converted to a number
        const ritcCode = !isNaN(searchQuery) ? Number(searchQuery) : null;

        // Build the $or array dynamically
        const orQuery = [
            { exporterName: regexQuery },
            { countryOfDestination: regexQuery },
            { itemDesc: regexQuery },
            { portOfDischarge: regexQuery },
            { currency: regexQuery },
        ];

        // Add ritcCode query only if it's a valid number
        if (ritcCode !== null) {
            orQuery.push({ ritcCode: ritcCode });
        }

        const exportData = await ExportData.find({
            $or: orQuery
        });

        res.json(exportData);
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

exportRouter.get("/api/exports/search-page", async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        if (!searchQuery) {
            return res.status(400).json({ error: "Query parameter 'q' is required" });
        }

        const regexQuery = { $regex: searchQuery, $options: "i" };

        // Determine if the search query can be converted to a number
        const ritcCode = !isNaN(searchQuery) ? Number(searchQuery) : null;

        // Build the $or array dynamically
        const orQuery = [
            { exporterName: regexQuery },
            { countryOfDestination: regexQuery },
            { itemDesc: regexQuery },
            { portOfDischarge: regexQuery },
            { currency: regexQuery },
        ];

        // Add ritcCode query only if it's a valid number
        if (ritcCode !== null) {
            orQuery.push({ ritcCode: ritcCode });
        }

        const exportData = await ExportData.find({
            $or: orQuery
        }).skip(skip).limit(limit);

        res.json(exportData);
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Internal server error" });
    }
});



exportRouter.get("/api/exports/by-name-page", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        const exportData = await ExportData
            .find({ exporterName: { $regex: req.query.exporterName, $options: "i" } })
            .skip(skip)
            .limit(limit);

        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-name", async (req, res) => {
    try {
        const exportData = await ExportData.find({ exporterName: { $regex: req.query.exporterName, $options: "i" } });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


exportRouter.get("/api/exports/by-country", async (req, res) => {
    try {
        const exportData = await ExportData.find({ countryOfDestination: { $regex: req.query.countryOfDestination, $options: "i" } });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-country-page", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        const exportData = await ExportData
            .find({ countryOfDestination: { $regex: req.query.countryOfDestination, $options: "i" } })
            .skip(skip)
            .limit(limit);

        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


exportRouter.get("/api/exports/by-itemDesc", async (req, res) => {
    try {
        const exportData = await ExportData.find({ itemDesc: { $regex: req.query.itemDesc, $options: "i" } });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-itemDesc-page", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        const exportData = await ExportData
            .find({ itemDesc: { $regex: req.query.itemDesc, $options: "i" } })
            .skip(skip)
            .limit(limit);

        res.json(exportData);
    } catch (e) {
        res.status500.json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-iec", async (req, res) => {
    try {
        const { iec, limit } = req.query;

        const limitValue = limit ? parseInt(limit, 10) : null;

        // Build the query
        let query = ExportData.find({ iec: { $regex: iec, $options: "i" } });

        if (limitValue) {
            query = query.limit(limitValue);
        }

        // Execute the query
        const exportData = await query;

        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


exportRouter.get("/api/exports/by-ritcCode", async (req, res) => {
    try {
        const ritcCode = Number(req.query.ritcCode);

        // If ritcCode is not a number, return an error
        if (isNaN(ritcCode)) {
            return res.status(400).json({ error: "Invalid ritcCode parameter" });
        }

        // Find export data with the specified ritcCode
        const exportData = await ExportData.find({ ritcCode: ritcCode });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-ritcCode-page", async (req, res) => {
    try {
        const ritcCode = Number(req.query.ritcCode);

        // If ritcCode is not a number, return an error
        if (isNaN(ritcCode)) {
            return res.status(400).json({ error: "Invalid ritcCode parameter" });
        }

        // Find export data with the specified ritcCode
        const exportData = await ExportData.find({ ritcCode: ritcCode });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


exportRouter.get("/api/exports/by-portOfDischarge", async (req, res) => {
    try {
        const exportData = await ExportData.find({ portOfDischarge: { $regex: req.query.portOfDischarge, $options: "i" } });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-portOfDischarge-page", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        const exportData = await ExportData
            .find({ portOfDischarge: { $regex: req.query.portOfDischarge, $options: "i" } })
            .skip(skip)
            .limit(limit);

        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



exportRouter.get("/api/exports/by-currency", async (req, res) => {
    try {
        const exportData = await ExportData.find({ currency: { $regex: req.query.currency, $options: "i" } });
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exportRouter.get("/api/exports/by-currency-page", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        const exportData = await ExportData
            .find({ currency: { $regex: req.query.currency, $options: "i" } })
            .skip(skip)
            .limit(limit);

        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


exportRouter.get("/api/exports/:id", async (req, res) => {
    try {
        const exportData = await ExportData.findById(req.params.id)
        res.json(exportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



exportRouter.patch("/api/exports/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const updatedExportData = await ExportData.findByIdAndUpdate(id, update, { new: true });

        if (!updatedExportData) {
            return res.status(404).json({ error: 'Export data not found' });
        }

        res.json(updatedExportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


exportRouter.delete("/api/exports/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the document by ID and update it
        const deletedExportData = await ExportData.findByIdAndDelete(id);
        if (!deletedExportData) {
            return res.status(404).json({ error: 'Export data not found' });
        }

        res.json(deletedExportData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = exportRouter;