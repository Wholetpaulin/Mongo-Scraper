// Controller for our notes
// ========================
var db = require("../models");
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    // Find one note
    findOne: function(req, res) {
        console.log("req.params.id: " + req.params.id);
        db.Note.find({
            "articleIdColumn": ObjectId(req.params.id)
        }).then(function(dbNote) {
            console.log("note response: " + dbNote);
            res.json(dbNote);
        }).catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
    },
    // Create a new note
    create: function(req, res) {
        console.log("create note post req: ");
        console.log(req.body);
        console.log("create note post req: ");
        db.Note.create(req.body).then(function(dbNote) {
            console.log("no error");
            return db.Headline.findOneAndUpdate({"_id": dbNote.articleIdColumn}, {
                $push: {
                    notes: dbNote._id
                }
            }, {new: true});
       })
       .then(function(dbHeadline) {
      // If the Headline notes array was updated successfully, send it back to the client
          res.json(dbHeadline);
    })
        // res.json(dbNote);
        // })
            .catch(function(err) {
            console.log("error occurred");
            console.log(err);
            console.log("error occurred");
            // If an error occurs, send it back to the client
            res.json(err);
        });
    },

    // Delete a note with a given id
    delete: function(req, res) {
        db.Note.remove({_id: req.params.id}).then(function(dbNote) {
            res.json(dbNote);
        }).catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
    }
};
