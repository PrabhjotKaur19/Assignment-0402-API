'use strict';

const Joi = require('joi');
const mongodb = require('mongodb').MongoClient;
require('dotenv').config();
var ObjectId = require('mongodb').ObjectID;

const itemSchema={
    grocery_store:Joi.string(),
    price:Joi.number(),
    date:Joi.date(),
    description:Joi.string()
};

module.exports= [    

    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
                reply('Welcome to Grocery Store API......');
            }
    },
    {
        method: 'GET',
        path: '/fooditems',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb.find().toArray((err,items)=>{
                if (err) {
                    return reply('Error has occured');
                }
                reply(items)
            db.close();
            })
            })
        }
    },

    {
        method: 'GET',
        path: '/fooditems/serachbyid/{id}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb.find({_id: ObjectId(request.params.id)}).toArray((err, item) => {
            if (err) {
                    return reply('Error has occured');
            }
            reply(item)
            db.close()
            })

            })

        }
    },

    {
        method: 'GET',
        path: '/fooditems/serachbyname/{itemName}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb.find({name: request.params.itemName}).sort({"best_deals.price":1}).toArray((err, items) => {
            if (err) {
                    return reply('Error has occured');
            }
            reply(items)
            db.close()
            })

            })

        }
    },

    {
        method: 'GET',
        path: '/fooditems/serachbystorename/{storeName}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb.find({"best_deals.grocery_store": request.params.storeName}).toArray((err, items) => {
            if (err) {
                    return reply('Error has occured');
            }
            reply(items)
            db.close()
            })

            })

        }
    },


    {
        method: 'POST',
        path: '/fooditems',
        handler: function (request, reply) {

            const item = request.payload;
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb._id = ObjectId();
            storedb.insert(item, (err, items) => {

                if (err) {
                    return reply('Error has occured');
                }

                reply(item);
            db.close();
            })
            })
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    best_deals:Joi.array().min(1).items(Joi.object(itemSchema)).required()
                }
            }
        }
    },

    {
        method: 'PUT',
        path: '/fooditems/{id}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb.update({_id: ObjectId(request.params.id)}, {$set: request.payload}, function (err, items) {
                if (err) {
                    return reply('Error has occured');
                }
                
                return reply('Updated.....').code(204);
            db.close();
            })
            })
        },
        config: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().optional(),
                    best_deals:Joi.array().min(1).items(Joi.object(itemSchema)).optional()
                }).required().min(1)
            }
        }
    },

    {
        method: 'DELETE',
        path: '/fooditems/{id}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var storedb=db.collection('storedb')
            storedb.findOneAndDelete({_id: ObjectId(request.params.id)}, function(err,items){
                if (err) {
                    return reply('Error has occured');
                }
                reply('Deleted......')
            db.close();
            });
            });
        }
    }

 ]