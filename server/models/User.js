import mongoose from 'mongoose';

// local
// import { Member, Role } from '../constant/enums';
const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: [true, 'Please specify a username'],
    unique: false,
    maxlength: [100, 'Username cannot be more than 100 characters'],
  },
  MartianId: {
    type: mongoose.Schema.ObjectId,
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Email is required'],
  },
  Password: {
    type: String,
    maxlength: [200, 'Media name cannot be more than 200 characters'],
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
    unique: false,
    maxlength: [100, 'PublicKey should not be more than 100 characters'],
  },
  //   Role: {
  //     type: String,
  //     enum: Role,
  //     default: Role.Author,
  //   },
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
  //   Author: {
  //     SocialLinks: [{ Link: String, Name: String }],
  //     Member: { type: String, enum: Member, default: Member.Silver },
  //     RecognizationsAndAwards: [{ Type: String, enum: RecognizationsAndAwards }],
  //     Certification: [{ Name: String, Organization: String }],
  //   },
});

// UserSchema.path('Username').validate(function (value) {
//   var self = this;
//   if (/\s/.test(value)) {
//     return false;
//   }
//   return true;
// }, 'Spaces not allowed in Username field. Please use - or _ or number');

export default mongoose.model('User', UserSchema);
