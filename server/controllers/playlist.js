// models
import Playlist from '../models/Playlist.js';
import validateToken from '../utils/validate-key.js';

export default {
  onGetPlaylist: async (req, res) => {
    try {
      const playlists = await Playlist.find();

      res.status(200).json(playlists);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onPostPlaylist: async (req, res) => {
    try {
      const data = req.body;
      const playlist = await Playlist.create({
        Title: data.Title,
        Author: data.Author,
        Description: data.Description,
        Tags: data.Tags,
        Provider: data.Provider,
      });

      res.status(201).json({ success: true, data: playlist });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};
