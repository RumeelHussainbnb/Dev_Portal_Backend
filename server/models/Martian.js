import mongoose from 'mongoose';

const MartianSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, 'Please add First Name'],
    maxlength: [100, 'First Name cannot be more than 100 characters'],
  },
  LastName: {
    type: String,
    required: [true, 'Please add Last Name'],
    maxlength: [100, 'Last Name name cannot be more than 100 characters'],
  },
  Expertise: {
    type: String,
    required: [true, 'Please add Expertise'],
    maxlength: [5000, 'Expertise cannot be more than 5000 characters'],
  },
  Country: {
    type: String,
    require: true,
    maxlength: [200, 'Country cannot be more than 200 characters'],
  },
  MartianType: {
    type: String,
    require: true,
    maxlength: [200, 'MartianType cannot be more than 200 characters'],
  },
  City: {
    type: String,
    require: true,
    maxlength: [200, 'City cannot be more than 200 characters'],
  },
  Languages: {
    type: String,
    require: true,
    maxlength: [1000, 'Languages cannot be more than 1000 characters'],
  },
  BioGraphy: {
    type: String,
    require: true,
    maxlength: [5000, 'BioGraphy cannot be more than 5000 characters'],
  },
});

// module.exports.default = mongoose.model('Content', ContentSchema);
export default mongoose.model('Martian', MartianSchema);
