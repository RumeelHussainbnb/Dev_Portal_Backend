import mongoose from 'mongoose';

// local
import { Member, Role, RecognizationsAndAwards } from '../constant/enums.js';
const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    unique: false,
    maxlength: [100, 'Username cannot be more than 100 characters'],
  },
  FirstName: {
    type: String,

    maxlength: [100, 'First Name cannot be more than 100 characters'],
  },
  LastName: {
    type: String,

    maxlength: [100, 'Last Name cannot be more than 100 characters'],
  },
  MartianId: {
    type: mongoose.Schema.ObjectId,
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  ProfilePicture: {
    type: String,
  },
  Token: {
    type: String,
    trim: true,
    maxlength: [500, 'Token cannot be more than 500 characters'],
  },
  TokenFirstCreatedAt: {
    type: Date,
    default: Date.now,
    // required: true
  },
  PublicKey: {
    type: String,
    unique: true,
    maxlength: [100, 'PublicKey should not be more than 100 characters'],
  },
  Roles: {
    type: [String],
    enum: Role,
  },
  TokenUpdatedAt: {
    type: Date,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
    // required: true
  },
  Bio: {
    type: String,
    required: false,
    maxlength: [300, 'Bio cannot be more than 300 characters'],
  },
  Country: {
    type: String,
  },
  City: {
    type: String,
  },
  Languages: {
    type: String,
  },
  ForgetPasswordLinkExpire: {
    type: Date,
  },
  ForgetPasswordLink: {
    type: String,
  },
  Skills: { type: Array },
  Author: {
    SocialLinks: [{ Link: String, Name: String }],
    Member: { type: String, enum: Member },
    RecognizationsAndAwards: [{ type: String, enum: RecognizationsAndAwards }],
    Certification: [{ Name: String, Organization: String }],
    MostPopular: [{ Name: String, Organization: String }],
    Contributions: [{ Name: String, Organization: String }],
  },
  MartianType: {
    type: String,
    default: undefined,
  },
});

// UserSchema.path('Username').validate(function (value) {
//   var self = this;
//   if (/\s/.test(value)) {
//     return false;
//   }
//   return true;
// }, 'Spaces not allowed in Username field. Please use - or _ or number');

export default mongoose.model('User', UserSchema);
