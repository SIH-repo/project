const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);  
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;  
        },
        minlength: 6
    },
    googleId: {
        type: String,  
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: [String],
        default: ["News"]

    }
});

userSchema.pre('save', async function(next) {

    if (!this.isModified('password') || !this.password) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);         
        this.password = await bcrypt.hash(this.password, salt); 
        next();
    } catch (err) {
        next(err);  
    }
});

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
