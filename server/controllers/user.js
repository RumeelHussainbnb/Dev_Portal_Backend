// models
import User from '../models/User.js';

export default {
  onGetAllUser: async (req, res) => {
    try {
      const { page, name } = req.query;
      const nameRegex = new RegExp(name, 'i'); // i for case insensitive
      let filterObject = {
        ...(name !== '' && { Username: { $regex: nameRegex } }),
      };
      const users = await User.find(filterObject)
        .limit(10)
        .skip((page - 1) * 10);
      const usersCount = await User.countDocuments(filterObject).exec();
      res.status(200).json({ success: true, data: { users, usersCount } });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },

  onGetUser: async (req, res) => {
    try {
      console.log(req.params.publicKey);
      const user = await User.findOne({ PublicKey: req.params.publicKey });

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetUserProfile: async (req, res) => {
    const { userID } = req.params;
    // security check
    if (userID != req?.userData?.userId) {
      res.status(400).json({ success: false, message: 'Bad request' });
    }

    try {
      const user = await User.findOne({ _id: userID });

      if (user && user._id == userID) {
        let updatedUser = JSON.parse(JSON.stringify(user));
        updatedUser = {
          ...updatedUser,
          Author: {
            ...updatedUser.Author,
            Rank: 808,
            Read: '12.2K',
            Reputation: '13K',
            Like: '5',
          },
        };
        return res
          .status(200)
          .json({ success: true, data: updatedUser, message: 'Successful' });
      } else {
        return res
          .status(404)
          .json({ success: false, data: {}, message: 'User not found' });
      }
    } catch (error) {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  },

  onUpdateUserProfile: async (req, res) => {
    const { userID } = req.params;

    // security check
    if (userID != req?.userData?.userId) {
      return res.status(400).json({ success: false, message: 'Bad request' });
    }
    // else find the user
    try {
      const tempUser = await User.findOne({ _id: userID });
      let updatedUser = {
        Username: req.body.Username,
        ProfilePicture: req.body.ProfilePicture,
        Bio: req.body.Bio,
        Skils: req.body.Skils,
        Country: req.body.Country,
        Email: req.body.Email,
        Author: {
          Member: tempUser?.Author?.Member,
          SocialLinks: req.body?.Author?.SocialLinks
            ? req.body?.Author?.SocialLinks.map((link) => {
                return {
                  Link: link.Link,
                  Name: link.Name,
                };
              })
            : [],
          RecognizationsAndAwards: req.body?.Author?.RecognizationsAndAwards
            ? req.body?.Author?.RecognizationsAndAwards
            : [],
          Certification: req.body?.Author?.Certification
            ? req.body?.Author?.Certification.map((cer) => {
                return {
                  Name: cer.Name,
                  Organization: cer.Organization,
                };
              })
            : [],
        },
      };
      await User.updateOne({ _id: userID }, updatedUser);
      res.status(200).json({ success: true, message: 'Successful' });
    } catch (error) {
      console.log('error ==>', error);
      res.status(404).json({ success: false, message: 'User not found' });
    }
  },
  onAddUserProfil: async (req, res) => {
    const { userID } = req.params;
    // security check
    if (userID != req?.userData?.userId) {
      res.status(400).json({ success: false, message: 'Bad request' });
    }

    try {
      console.log('req.file ==<', req.file);
      let imageURL =
        req.protocol +
        '://' +
        req.headers.host +
        '/server/public/images/' +
        req.file.filename;
      await User.updateOne(
        { _id: req?.userData?.userId },
        { ProfilePicture: imageURL }
      );

      return res.status(200).json({ success: true, message: 'Successful' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Something went wrong.' });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      console.log(req.params.Id);
      const user = await User.findOne({ _id: req.params.Id });

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
};
