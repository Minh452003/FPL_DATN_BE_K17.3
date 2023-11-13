import Banner from '../models/banner.js'
export const createBanner= async (req, res) => {
    try {
      const newBanner = await Banner.create(req.body);
      res.status(201).json(newBanner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const getAllBanners= async (req, res) => {
    try {
      const banners = await Banner.find();
      res.status(200).json(banners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const getBannerById = async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);
      if (banner) {
        res.status(200).json(banner);
      } else {
        res.status(404).json({ message: 'Banner not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const updateBanner = async (req, res) => {
    try {
      const updatedBanner = await Banner.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (updatedBanner) {
        res.status(200).json(updatedBanner);
      } else {
        res.status(404).json({ message: 'Banner not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const deleteBanner = async (req, res) => {
    try {
      const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
      if (deletedBanner) {
        res.status(200).json({ message: 'Banner deleted successfully' });
      } else {
        res.status(404).json({ message: 'Banner not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
