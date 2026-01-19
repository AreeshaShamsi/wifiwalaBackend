import Plan from '../../models/Plan.js';

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { providerName, speed, price, validity, data } = req.body;

    if (!providerName || !speed || !price || !validity || !data) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { providerName, speed, price, validity, data },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.json({ success: true, message: 'Plan updated successfully', plan: updatedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export default updatePlan;
