const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    alertTitle: {
        type: String,
        required: true,
        trim: true,      
    },
    date: {
        type: Date,
        required: true,
    },
    link: {
        type: String,
        required: true, 
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,       
    },
    level :{
        type:String,
        required: true,
        enum: ['News', 'Emergency', 'Sports'],
        message: '{VALUE} is not a valid category!'
    }
});

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    alerts: [alertSchema] 
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
