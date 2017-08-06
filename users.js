'use strict';

const Joi = require('joi');
const mongodb = require('mongodb').MongoClient;
require('dotenv').config();
var ObjectId = require('mongodb').ObjectID;

module.exports= [    

    {
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var usersdb=db.collection('usersdb')
            usersdb.find().toArray((err,user)=>{
                if (err) {
                    return reply('Error has occured');
                }
                reply(user)
            db.close();
            })
            })
        }
    },

    {
        method: 'GET',
        path: '/users/serachbyid/{id}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var usersdb=db.collection('usersdb')
            usersdb.find({_id: ObjectId(request.params.id)}).toArray((err, user) => {
            if (err) {
                    return reply('Error has occured');
            }
            reply(user)
            db.close()
            })

            })

        }
    },

    {
        method: 'GET',
        path: '/users/serachbyname/{userName}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var usersdb=db.collection('usersdb')
            usersdb.find({name: request.params.userName}).toArray((err, user) => {
            if (err) {
                    return reply('Error has occured');
            }
            reply(user)
            db.close()
            })

            })

        }
    },


    {
        method: 'POST',
        path: '/users',
        handler: function (request, reply) {

            const item = request.payload;
            mongodb.connect(process.env.URL, function(err, db) {
            var usersdb=db.collection('usersdb')
            usersdb._id = ObjectId();
            usersdb.insert(item, (err, user) => {

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
                    email:Joi.string().email().required()
                }
            }
        }
    },

    {
        method: 'PUT',
        path: '/users/{id}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var usersdb=db.collection('usersdb')
            usersdb.update({_id: ObjectId(request.params.id)}, {$set: request.payload}, function (err, user) {
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
                    email:Joi.string().email().optional()
                }).required().min(1)
            }
        }
    },

    {
        method: 'DELETE',
        path: '/users/{id}',
        handler: function (request, reply) {
            mongodb.connect(process.env.URL, function(err, db) {
            var usersdb=db.collection('usersdb')
            usersdb.findOneAndDelete({_id: ObjectId(request.params.id)}, function(err,user){
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