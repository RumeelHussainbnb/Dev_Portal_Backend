import mongoose from 'mongoose';
const { Schema } = mongoose;

const ActivitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      maxlength: [100, 'Date cannot be more than 2048 characters'],
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    activity: {
      type: String,

      maxlength: [100, 'Activity Name cannot be more than 100 characters'],
    },
    activityLink: {
      type: String,
    },
    type: {
      type: String,

      maxlength: [200, 'Activity Link cannot be more than 200 characters'],
    },
    primaryContributionArea: {
      type: String,

      maxlength: [
        100,
        'Primary Contribution Area cannot be more than 100 characters',
      ],
    },
    additionalContributionArea: {
      type: String,

      maxlength: [
        100,
        'Additional Contribution Area cannot be more than 100 characters',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', ActivitySchema);
